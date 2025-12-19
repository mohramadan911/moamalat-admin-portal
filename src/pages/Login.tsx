import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoginForm from '../components/forms/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 bg-gray-50">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
