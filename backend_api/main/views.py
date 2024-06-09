from rest_framework import generics,permissions
from django.contrib.auth.models import User
from . import serializers
from . import models
from django.conf import settings
import razorpay
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Customer,Brand,Shoe,Size,Wishlist,CartItem,Address,Order
from .serializers import BrandSerializer, SizeSerializer, ShoeSerializer, WishlistSerializer
from .serializers import UserSerializer
import io
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist import models as blacklist_models




class Admin(generics.ListCreateAPIView):
    queryset=models.Admin.objects.all()
    serializer_class=serializers.AdminSerializer
    

class AdminDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset=models.Admin.objects.all()
    serializer_class=serializers.AdminDetailSerializer
   
class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            Customer.objects.create(
                user=user,
                first_name=request.data['customer']['first_name'],
                last_name=request.data['customer']['last_name'],
                phone_number=request.data['customer']['phone_number']
            )
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=user.username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            customer = Customer.objects.get(user=user)
            customer_serializer = serializers.CustomerSerializer(customer)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_superuser': user.is_superuser,
                'customer': customer_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)

        
# class LogoutView(APIView):
#     def post(self, request, *args, **kwargs):
#         logout(request)
#         return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        # Invalidate the refresh token
        refresh_token = request.data.get('refresh')
        if refresh_token:
            blacklist_models.BlacklistedToken.objects.create(token=refresh_token)
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    
    
class BrandListCreateView(generics.ListCreateAPIView):
    queryset = Brand.objects.all()
    serializer_class = serializers.BrandSerializer

class SizeListCreateView(generics.ListCreateAPIView):
    queryset = Size.objects.all()
    serializer_class = serializers.SizeSerializer

class ShoeListCreateView(generics.ListCreateAPIView):
    queryset = Shoe.objects.all()
    serializer_class = serializers.ShoeSerializer

class ShoeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Shoe.objects.all()
    serializer_class = serializers.ShoeSerializer
    
    

class WishlistCreateView(generics.CreateAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        customer = Customer.objects.get(user=request.user)
        shoe_id = request.data.get('shoe')
        shoe = Shoe.objects.get(id=shoe_id)
        wishlist_item, created = Wishlist.objects.get_or_create(customer=customer, shoe=shoe)
        if not created:
            return Response({"detail": "This shoe is already in your wishlist."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(wishlist_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class WishlistListView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        customer = Customer.objects.get(user=self.request.user)
        return Wishlist.objects.filter(customer=customer)
    
class WishlistItemDetailView(generics.DestroyAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CustomerListView(generics.ListAPIView):
    queryset = Customer.objects.all()
    serializer_class = serializers.CustomerSerializer
    permission_classes = [IsAuthenticated]
    
class AuthenticatedCustomerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            serializer = serializers.CustomerSerializer(customer)
            return Response(serializer.data)
        except Customer.DoesNotExist:
            return Response({"detail": "Customer not found"}, status=404)
        
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CartItem, Customer, Shoe, Size
from .serializers import CartItemSerializer

class CartItemListCreateView(generics.ListCreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        customer = Customer.objects.get(user=self.request.user)
        return CartItem.objects.filter(customer=customer)

    def create(self, request, *args, **kwargs):
        customer = Customer.objects.get(user=request.user)
        shoe_id = request.data.get('shoe')
        size_id = request.data.get('size')
        quantity = request.data.get('quantity', 1)
        shoe = Shoe.objects.get(id=shoe_id)
        size = Size.objects.get(id=size_id)
        cart_item, created = CartItem.objects.get_or_create(customer=customer, shoe=shoe, size=size)
        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()
        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CartItemDestroyView(generics.DestroyAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        customer = Customer.objects.get(user=self.request.user)
        return CartItem.objects.filter(customer=customer)

class CartItemUpdateView(generics.UpdateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        customer = Customer.objects.get(user=self.request.user)
        return CartItem.objects.filter(customer=customer)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.quantity = request.data.get('quantity', instance.quantity)
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
class AddressListCreateView(generics.ListCreateAPIView):
    queryset = Address.objects.all()
    serializer_class = serializers.AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        customer = Customer.objects.get(user=self.request.user)
        return Address.objects.filter(customer=customer)

    def create(self, request, *args, **kwargs):
        customer = Customer.objects.get(user=request.user)
        data = request.data.copy()
        data['customer'] = customer.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Address.objects.all()
    serializer_class = serializers.AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        customer = Customer.objects.get(user=self.request.user)
        return Address.objects.filter(customer=customer)
    
class CreateRazorpayOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        amount = request.data.get('amount')
        currency = 'INR'
        receipt = 'order_rcptid_11'
        notes = {
            'address': 'Razorpay Corporate Office'
        }
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        payment = client.order.create({'amount': amount, 'currency': currency, 'receipt': receipt, 'notes': notes})
        return Response(payment)
    
class VerifyPayment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        payment_id = request.data.get('payment_id')
        order_id = request.data.get('order_id')
        signature = request.data.get('signature')

        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            })

            # Extract other details from the request
            address_id = request.data.get('address_id')
            total_price = request.data.get('total_price')
            shoe_model = request.data.get('shoe_model')

            # Save the order
            customer = Customer.objects.get(user=request.user)
            address = Address.objects.get(id=address_id)
            Order.objects.create(
                customer=customer,
                address=address,
                shoe_model=shoe_model,
                total_price=total_price,
                payment_id=payment_id
            )

            # Empty the cart for the customer
            CartItem.objects.filter(customer=customer).delete()

            return Response({'status': 'success', 'redirect_url': '/customer'})
        except razorpay.errors.SignatureVerificationError:
            return Response({'status': 'failure'}, status=400)


class CustomerOrderListView(generics.ListAPIView):
    serializer_class = serializers.OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        customer = Customer.objects.get(user=self.request.user)
        return Order.objects.filter(customer=customer)
    
    
class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.all()
    serializer_class = serializers.OrderSerializer
    permission_classes = [IsAuthenticated]