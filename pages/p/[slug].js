import { useRouter } from "next/router";
import App from "components/App";
import InfoBox from "components/InfoBox";
import Header from "components/Header";
import SerachBox from "components/SearchBox";
import PostListFiltered, {
  FILTERED_POSTS_QUERY,
  filteredPostsQueryVars,
} from "components/PostListFiltered";
import { initializeApollo } from "lib/apolloClient";

const IndexPage = () => {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  return (
    <App>
      <Header />
      <InfoBox>
        ℹ️ This page uses getServerSideProps on a dynamic route.
      </InfoBox>
      <SerachBox />
      <h1>Results for "{slug}"</h1>
      <PostListFiltered />
      <style jsx>{`
        h1 {
          font-size: 20px;
        }
      `}</style>
    </App>
  );
};

export async function getServerSideProps({ params }) {
  const apolloClient = initializeApollo();
  const title = params?.slug || "";
  await apolloClient.query({
    query: FILTERED_POSTS_QUERY,
    variables: { ...filteredPostsQueryVars, title },
  });
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default IndexPage;
