import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Por favor ingrese una contraseña."),
    email: Yup.string()
      .email("Por favor ingrese un email válido.")
      .required("El email es obligatorio."),
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate({ email, password });
      setError("");

      try {
        const response = await axiosInstance.post("/login", {
          email: email,
          password: password,
        });
        if (response.data && response.data.accessToken) {
          localStorage.setItem("token", response.data.accessToken);
          navigate("/dashboard");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.data && error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError(
              "Un error inesperado ocurrió. Por favor intente de nuevo."
            );
          }
        } else {
          setError("No se pudo conectar con el servidor.");
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center mt-28 select-none">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Ingresar</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="text-sm text-center mt-4">
              ¿No estas Registrado aún?{" "}
              <Link to="/signUp" className="font-medium text-primary underline">
                Crear una Cuenta
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
