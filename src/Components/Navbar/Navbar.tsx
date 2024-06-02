import React, { useCallback, useState } from "react";
import "./Navbar.css";
import useStore from "../../store/useStore";
import { debounce } from 'lodash';
import useKeywordStore from "../../store/useKeywordStore";

const Navbar = () => {
  const [query, setQuery] = useState('');
  const setKeyword = useKeywordStore((state) => state.setKeyword);
  // const {keyword , setKeyword} = useKeywordStore();
  const fetchRepositories = useStore((state) => state.fetchRepositories);

  const debouncedFetchRepositories = useCallback(
    debounce((value: string) => {
      fetchRepositories(value);
    }, 500),
    []
  );
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setKeyword(newQuery); 
    debouncedFetchRepositories(query);
  };

  return (
    <nav className="navbar">
      <h1>GitHub Repository Explorer</h1>
      <div className="input-group mb-3 mt-3">
      <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search for repositories..."
          aria-label="Search"
          value={query}
          onChange={handleSearch}
        />
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-search"></i>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
