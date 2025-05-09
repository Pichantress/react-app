import { Link } from "react-router-dom";

const ErrorPage = ()=>{
    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-xl mb-6">Akses ditolak. Anda harus login terlebih dahulu.</p>
      <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Kembali ke Login
      </Link>
    </div>
  );
}

export default ErrorPage