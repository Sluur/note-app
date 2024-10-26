/* eslint-disable react/prop-types */
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials("Rodrigo Haro")}
      </div>
      <div>
        <p className="text-sm font-medium">Rodrigo Haro</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Salir
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
