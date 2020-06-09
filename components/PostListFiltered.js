import { useQuery, NetworkStatus, gql } from "@apollo/client";
// import gql from "graphql-tag";
import { useRouter } from "next/router";
import ErrorMessage from "components/ErrorMessage";
import PostUpvoter from "components/PostUpvoter";

export const FILTERED_POSTS_QUERY = gql`
  query filteredPosts($first: Int!, $skip: Int!, $title: String) {
    allPosts(
      orderBy: createdAt_DESC
      first: $first
      skip: $skip
      filter: { title_contains: $title }
    ) {
      id
      title
      votes
      url
      createdAt
    }
    _allPostsMeta {
      count
    }
  }
`;

export const filteredPostsQueryVars = {
  skip: 0,
  first: 10,
};

export default function PostDetail() {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    FILTERED_POSTS_QUERY,
    {
      variables: { ...filteredPostsQueryVars, title: slug },
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true,
    }
  );

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: allPosts.length,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          // Append the new posts results to the old one
          allPosts: [...previousResult.allPosts, ...fetchMoreResult.allPosts],
        });
      },
    });
  };

  if (error) return <ErrorMessage message="Error loading posts." />;
  // if (loading && !loadingMorePosts) return <div>Loading</div>;
  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }
  const allPosts = data?.allPosts || [];
  const _allPostsMeta = data?._allPostsMeta || [];
  const areMorePosts = allPosts.length < _allPostsMeta.count;

  return (
    <section>
      {loading && <div>Loading...</div>}
      <ul>
        {allPosts.map((post, index) => (
          <li key={post.id}>
            <div>
              <span>{index + 1}. </span>
              <a href={post.url}>{post.title}</a>
              <PostUpvoter id={post.id} votes={post.votes} />
            </div>
          </li>
        ))}
      </ul>
      {areMorePosts && (
        <button onClick={() => loadMorePosts()} disabled={loadingMorePosts}>
          {loadingMorePosts ? "Loading..." : "Show More"}
        </button>
      )}
      <style jsx>{`
        section {
          padding-bottom: 20px;
        }
        li {
          display: block;
          margin-bottom: 10px;
        }
        div {
          align-items: center;
          display: flex;
        }
        a {
          font-size: 14px;
          margin-right: 10px;
          text-decoration: none;
          padding-bottom: 0;
          border: 0;
        }
        span {
          font-size: 14px;
          margin-right: 5px;
        }
        ul {
          margin: 0;
          padding: 0;
        }
        button:before {
          align-self: center;
          border-style: solid;
          border-width: 6px 4px 0 4px;
          border-color: #ffffff transparent transparent transparent;
          content: "";
          height: 0;
          margin-right: 5px;
          width: 0;
        }
      `}</style>
    </section>
  );
}
