import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

/**
 * SelectContacts component
 * Lets the user select which users to add to their chat list (contacts)
 * Calls the backend to save the selected contacts
 */
const SelectContacts = ({ onComplete }) => {
  // List of all users from the backend
  const [allUsers, setAllUsers] = useState([]);
  // IDs of users selected as contacts
  const [selectedContacts, setSelectedContacts] = useState([]);
  // Loading state
  const [loading, setLoading] = useState(false);

  // Fetch all users except the current user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/messages/users?all=true");
        setAllUsers(res.data);
      } catch (err) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle checkbox change
  const handleCheckbox = (userId) => {
    setSelectedContacts((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Save selected contacts to backend
  const handleSave = async () => {
    try {
      setLoading(true);
      await axiosInstance.put("/auth/contacts", { contacts: selectedContacts });
      toast.success("Contacts updated!");
      onComplete(); // Callback to close modal or refresh UI
    } catch (err) {
      toast.error("Failed to update contacts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Select users to add to your chat list</h2>
      {loading && <div>Loading...</div>}
      <div className="max-h-60 overflow-y-auto mb-4">
        {allUsers.map((user) => (
          <label key={user._id} className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              checked={selectedContacts.includes(user._id)}
              onChange={() => handleCheckbox(user._id)}
              className="checkbox checkbox-sm"
            />
            <img src={user.profilePic || "/avatar.png"} alt={user.fullName} className="size-8 rounded-full" />
            <span>{user.fullName}</span>
          </label>
        ))}
      </div>
      <button className="btn btn-primary w-full" onClick={handleSave} disabled={loading}>
        Save Contacts
      </button>
    </div>
  );
};

export default SelectContacts;
