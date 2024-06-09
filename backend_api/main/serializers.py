from rest_framework import serializers
from . import models
from django.contrib.auth.models import User
from .models import Customer,Brand,Size,Shoe,Wishlist,CartItem,Address,Order

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model=models.Admin
        fields=['id','user','address']
        
    def __init__(self, *args, **kwargs):
        super(AdminSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1
        
class AdminDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model=models.Admin
        fields=['id','user','address']
        
    def __init__(self, *args, **kwargs):
        super(AdminDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1
             
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CustomerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')

    class Meta:
        model = Customer
        fields = ['first_name', 'last_name', 'phone_number', 'username', 'email']
        
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'size']

class ShoeSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    sizes_display = serializers.SerializerMethodField()

    class Meta:
        model = Shoe
        fields = ['id', 'brand', 'brand_name', 'gender', 'model_name', 'image', 'details', 'price', 'color', 'sizes', 'sizes_display']
    
    brand = serializers.PrimaryKeyRelatedField(queryset=Brand.objects.all())
    sizes = serializers.PrimaryKeyRelatedField(queryset=Size.objects.all(), many=True)

    def get_sizes_display(self, obj):
        return [{'id': size.id, 'size': size.size} for size in obj.sizes.all()]

    def update(self, instance, validated_data):
        sizes_data = validated_data.pop('sizes', None)
        instance = super().update(instance, validated_data)
        if sizes_data is not None:
            instance.sizes.set(sizes_data)
        return instance


class WishlistSerializer(serializers.ModelSerializer):
    shoe_details = ShoeSerializer(source='shoe', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'customer', 'shoe', 'shoe_details', 'added_at']
        read_only_fields = ['added_at']
        

class CartItemSerializer(serializers.ModelSerializer):
    shoe_details = ShoeSerializer(source='shoe', read_only=True)
    size_details = SizeSerializer(source='size', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'customer', 'shoe', 'shoe_details', 'size', 'size_details', 'quantity', 'added_at']
        read_only_fields = ['added_at']
        
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'customer', 'name', 'street', 'city', 'state', 'pincode', 'mobile1', 'mobile2']
        
class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    address = AddressSerializer(read_only=True)
    model_name = serializers.SerializerMethodField()
    brand = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'customer', 'address', 'model_name', 'brand', 'size', 'price', 'total_price', 'payment_id', 'created_at']

    def get_model_name(self, obj):
        if obj.shoe_model and isinstance(obj.shoe_model, list) and len(obj.shoe_model) > 0:
            return obj.shoe_model[0].get('shoe_details', {}).get('model_name', 'N/A')
        return 'N/A'

    def get_brand(self, obj):
        if obj.shoe_model and isinstance(obj.shoe_model, list) and len(obj.shoe_model) > 0:
            return obj.shoe_model[0].get('shoe_details', {}).get('brand_name', 'N/A')
        return 'N/A'

    def get_size(self, obj):
        if obj.shoe_model and isinstance(obj.shoe_model, list) and len(obj.shoe_model) > 0:
            return obj.shoe_model[0].get('size_details', {}).get('size', 'N/A')
        return 'N/A'

    def get_price(self, obj):
        if obj.shoe_model and isinstance(obj.shoe_model, list) and len(obj.shoe_model) > 0:
            return obj.shoe_model[0].get('shoe_details', {}).get('price', 'N/A')
        return 'N/A'
