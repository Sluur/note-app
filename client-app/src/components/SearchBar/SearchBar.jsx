/* eslint-disable react/prop-types */
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Buscar Nota"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <IoMdClose
          className="text-lg text-slate-500 cursor-pointer hover:text-black mr-2 flex-shrink-0 transition duration-200 ease-in-out hover:scale-110"
          onClick={onClearSearch}
        />
      )}
      <FaMagnifyingGlass
        className="text-sm text-slate-400 cursor-pointer hover:text-black flex-shrink-0  transition duration-200 ease-in-out hover:scale-110"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
