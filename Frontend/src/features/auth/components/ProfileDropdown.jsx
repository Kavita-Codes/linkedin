const ProfileDropdown = () => {
  return (
    <div className="absolute right-0 mt-10 w-45 bg-white border rounded shadow-lg z-[100] p-4">
      <div className="text-center font-bold">Kavita Chauhan</div>
      <button className="w-full border border-blue-600 rounded-full py-1 mt-2 text-blue-600">View Profile</button>
      <hr className="my-3" />
      <button className="text-red-600  font-bold">Sign Out</button>
    </div>
  );
};
export default ProfileDropdown;