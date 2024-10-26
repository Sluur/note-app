import { useState } from "react";
import PasswordInput from "./../../components/Input/PasswordInput";
import { Link } from "react-router-dom";

import * as Yup from "yup";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Por favor ingrese una contraseña."),
    email: Yup.string()
      .email("Por favor ingrese un email válido.")
      .required("El email es obligatorio."),

    name: Yup.string().required("Por favor ingrese su nombre."),
  });

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate({ password, email, name });
      setError("");
      // SIGN UP API CALL
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center mt-28 select-none">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Registrarse</h4>
            <input
              type="text"
              placeholder="Nombre"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              Crear Cuenta
            </button>
            <p className="text-sm text-center mt-4">
              ¿Ya estas registrado?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Iniciar Sesion
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
export default SignUp;
