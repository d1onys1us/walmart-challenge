import { useState, useEffect } from "react";
import "./App.css";
import ReactPaginate from "react-paginate";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/view_issue/:id" exact component={ViewIssue} />
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

// Home component
function Home() {
  // Constants
  const organization = "walmartlabs";
  const repo = "thorax";
  const [currentPage, setCurrentPage] = useState(0);
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(null);
  const PER_PAGE = 9;
  const offset = currentPage * PER_PAGE;
  // Slice and set current page data from fetch issues
  const currentPageData = issues.slice(offset, offset + PER_PAGE);
  const pageCount = Math.ceil(issues.length / PER_PAGE);

  useEffect(() => {
    fetchIssues();
  }, []);

  function fetchIssues() {
    fetch(
      "https://api.github.com/repos/" + organization + "/" + repo + "/issues"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIssues(result);
        },
        (error) => {
          setError(error);
        }
      );
  }

  function makeGrid(listOfIssues) {
    return (
      <GridList cellHeight={300} cols={3}>
        {listOfIssues.map((issue) => (
          <GridListTile key={issue.id} cols={1}>
            <Issue
              key={issue.id}
              issue={issue}
              title={issue.title}
              url={issue.html_url}
              number={issue.number}
              state={issue.state}
            />
          </GridListTile>
        ))}
      </GridList>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        <div className="container mt-3">
          <center>
            <Button variant="contained" color="primary" onClick={fetchIssues}>
              Refresh Issues
            </Button>
          </center>
          {makeGrid(currentPageData)}
        </div>
        <footer className="footer mt-auto py-3">
          <div className="container text-center">
            <ReactPaginate
              containerClassName="pagination"
              breakClassName="page-item"
              breakLabel={<div className="page-link">...</div>}
              pageClassName="page-item"
              previousClassName="page-item"
              nextClassName="page-item"
              pageLinkClassName="page-link"
              previousLinkClassName="page-link"
              nextLinkClassName="page-link"
              activeClassName="active"
              pageCount={pageCount}
              onPageChange={handlePageClick}
            />
          </div>
        </footer>
      </>
    );
  }

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
}

// Issue component
function Issue(props) {
  return (
    <div
      className="my-3 mx-auto card text-center"
      style={{ width: "18rem", height: "12rem" }}
    >
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">Issue #{props.number}</h6>
        <p>
          State: <b>{props.state}</b>
        </p>
        <Link
          to={{
            pathname: "/view_issue/" + props.issue.id,
            state: { issue: props.issue },
          }}
        >
          View Issue
        </Link>
      </div>
    </div>
  );
}

// View issue component
function ViewIssue(props) {
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/walmartlabs/thorax/issues")
      .then((res) => res.json())
      .then(
        (result) => {
          let pathname = props.location.pathname;
          let lastBackslashIndex = pathname.lastIndexOf("/");
          let issueId = pathname.substring(
            lastBackslashIndex + 1,
            pathname.length + 1
          );
          setIssue(result.find((i) => i.id === parseInt(issueId)));
        },
        (error) => {
          console.log("oh no!");
        }
      );
      // dependency array
  }, [props.location.pathname]);

  if (issue !== null) {
    return (
      <div className="mt-3 container">
        <Link to="/">⭠ Back to issues</Link>
        <h1>{issue.title}</h1>
        <h3 className="text-muted">Issue #{issue.number}</h3>
        <p>
          State: <b>{issue.state}</b>
        </p>
        <p>Created at: {issue.created_at}</p>
        <p>URL: {issue.url}</p>
        <p>Description: </p>
        <hr />
        <p>{issue.body}</p>
      </div>
    );
  } else {
    return <p>LOADING...</p>;
  }
}

export default App;
