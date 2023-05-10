import React from "react";

const Repo = ({ repo }: any) => {
  return (
    <div>
      <div>
        <div>{repo.name}</div>
        <div>{repo.stargazers_count}</div>
      </div>
      <div>{repo.updated_at}</div>
      <a href={repo.html_url}>Link to repository: {repo.html_url}</a>
    </div>
  );
};

export default Repo;
