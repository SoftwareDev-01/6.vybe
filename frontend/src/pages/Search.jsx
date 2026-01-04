import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { serverUrl } from "../App";
import dp from "../assets/dp.webp";

function Search() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  /* ================= SEARCH ================= */

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/user/search?keyWord=${query}`,
          { withCredentials: true }
        );
        setResults(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [query]);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="h-[56px] flex items-center gap-4 px-4 border-b border-gray-800">
        <MdOutlineKeyboardBackspace
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <span className="text-sm font-semibold">Search</span>
      </div>

      {/* Search bar */}
      <div className="px-4 py-3">
        <div className="h-9 rounded-md bg-[#121212] flex items-center px-3 gap-2">
          <FiSearch className="text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              bg-transparent w-full
              text-sm text-white
              outline-none
              placeholder-gray-500
            "
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col">
        {results.map((user) => (
          <div
            key={user._id}
            onClick={() => navigate(`/profile/${user.userName}`)}
            className="
              flex items-center gap-3
              px-4 py-3
              cursor-pointer
              hover:bg-[#121212]
              transition
            "
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={user.profileImage || dp}
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-medium">{user.userName}</p>
              <p className="text-xs text-gray-400">{user.name}</p>
            </div>
          </div>
        ))}

        {/* Empty states */}
        {query && results.length === 0 && (
          <p className="px-4 py-6 text-sm text-gray-500">
            No results found
          </p>
        )}

        {!query && (
          <p className="px-4 py-6 text-sm text-gray-500">
            Search for people
          </p>
        )}
      </div>
    </div>
  );
}

export default Search;
