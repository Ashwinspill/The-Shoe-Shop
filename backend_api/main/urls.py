from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/',views.Admin.as_view()),
    path('admins/<int:pk>/',views.AdminDetail.as_view()),
    path('admin/orders/', views.AdminOrderListView.as_view(), name='admin-order-list'), 
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'), 
    path('brands/', views.BrandListCreateView.as_view(), name='brand-list-create'),
    path('sizes/', views.SizeListCreateView.as_view(), name='size-list-create'),
    path('shoes/', views.ShoeListCreateView.as_view(), name='shoe-list-create'),
    path('shoes/<int:pk>/', views.ShoeDetailView.as_view(), name='shoe-detail'),
    path('wishlist/', views.WishlistCreateView.as_view(), name='wishlist-create'),
    path('wishlist/my/', views.WishlistListView.as_view(), name='wishlist-list'),
    path('wishlist/<int:pk>/', views.WishlistItemDetailView.as_view(), name='wishlist-item-detail'),  # Add this line
    path('customers/', views.CustomerListView.as_view(), name='customer-list'),
    path('customer/', views.AuthenticatedCustomerDetailView.as_view(), name='authenticated-customer-detail'),
    path('cart/', views.CartItemListCreateView.as_view(), name='cart-list-create'),
    path('cart/<int:pk>/', views.CartItemDestroyView.as_view(), name='cart-destroy'),
    path('cart/update/<int:pk>/', views.CartItemUpdateView.as_view(), name='cart-update'),
    path('addresses/', views.AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', views.AddressDetailView.as_view(), name='address-detail'),
    path('order/', views.CreateRazorpayOrder.as_view(), name='create-razorpay-order'),
    path('verify-payment/', views.VerifyPayment.as_view(), name='verify-payment'),
    path('orders/', views.CustomerOrderListView.as_view(), name='customer-order-list'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
