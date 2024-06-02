// import React, { useEffect, useState } from "react";
import "./RepoList.css";
import useStore from "../../store/useStore";
import { Repository } from '../../store/useStore';
import useKeywordStore from "../../store/useKeywordStore";

const RepoList = () => {
  const repositories = useStore((state) => state.repositories);
  const starRepository = useStore((state) => state.starRepository);
  const unstarRepository = useStore((state) => state.unstarRepository);

  const handleStar = (repo: Repository) => {
    if (repo.viewer_has_starred) {
      unstarRepository(repo);
    } else {
      starRepository(repo);
    }
  };
  const getTenRepos = repositories.slice(0,10);
  const {keyword} = useKeywordStore();

  return (
    <>
    { keyword != '' ?
    <div className="table-responsive">
        <table className="table table-hover">
        <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Repository name</th>
              <th scope="col">Owner's username</th>
              <th scope="col">Description</th>
              <th scope="col">Number of stars</th>
              <th scope="col">Number of forks</th>
              <th scope="col">Star/Unstar</th>
            </tr>
          </thead>
          <tbody>
            {getTenRepos?.map((repo, index) => {
              return (
              <tr className="repo-preview" key={repo.id}>
                <td scope="row">{index + 1}</td>
                <td>{repo.name}</td>
                <td>{repo.owner.login}</td>
                <td style={{color: repo.description ? "#333" : "red"}}>
                  {repo.description ? repo.description : "No Discription"}
                </td>
                <td>{repo.stargazers_count}</td>
                <td>{repo.forks_count}</td>
                <td>
                  <button className="btn btn-outline-danger btn-block" style={{width: 100}} onClick={() => handleStar(repo)}>  {repo.viewer_has_starred ? 'Unstar' : 'Star'}</button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
    </div>
    :
    <div className="no-result">
      <h1 className="hi">Hi 👋 </h1>
      <br /> 
      <h2 className="message">Please enter repositorie name you would like to search for...</h2>
    </div>
    }
    </>
  );
};

export default RepoList;
