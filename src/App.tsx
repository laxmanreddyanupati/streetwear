import { Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { AdminGate } from '@/components/admin/AdminGate';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AccountLayout } from '@/components/account/AccountLayout';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { CollectionsPage } from '@/pages/CollectionsPage';
import { CollectionDetailPage } from '@/pages/CollectionDetailPage';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { FaqPage } from '@/pages/FaqPage';
import { PolicyPage } from '@/pages/PolicyPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/pages/account/LoginPage';
import { RegisterPage } from '@/pages/account/RegisterPage';
import { ForgotPasswordPage } from '@/pages/account/ForgotPasswordPage';
import { AccountProfilePage } from '@/pages/account/AccountProfilePage';
import { AccountOrdersPage } from '@/pages/account/AccountOrdersPage';
import { AccountOrderDetailPage } from '@/pages/account/AccountOrderDetailPage';
import { AccountAddressesPage } from '@/pages/account/AccountAddressesPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminInventoryPage } from '@/pages/admin/AdminInventoryPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from '@/pages/admin/AdminCustomersPage';
import { AdminPromotionsPage } from '@/pages/admin/AdminPromotionsPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';

export function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="collections/:slug" element={<CollectionDetailPage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/success/:orderId" element={<OrderConfirmationPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="shipping" element={<PolicyPage policy="shipping" />} />
        <Route path="returns" element={<PolicyPage policy="returns" />} />
        <Route path="privacy" element={<PolicyPage policy="privacy" />} />
        <Route path="terms" element={<PolicyPage policy="terms" />} />
        <Route path="account/login" element={<LoginPage />} />
        <Route path="account/register" element={<RegisterPage />} />
        <Route path="account/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="account"
          element={
            <RequireAuth>
              <AccountLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AccountProfilePage />} />
          <Route path="orders" element={<AccountOrdersPage />} />
          <Route path="orders/:orderId" element={<AccountOrderDetailPage />} />
          <Route path="addresses" element={<AccountAddressesPage />} />
        </Route>
        <Route
          path="admin"
          element={
            <AdminGate>
              <AdminLayout />
            </AdminGate>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
