import App from "components/App";
import InfoBox from "components/InfoBox";
import Header from "components/Header";
import SearchBox from "components/SearchBox";

const IndexPage = () => {
  return (
    <App>
      <Header />
      <InfoBox>ℹ️ This page will generate a dynamic route.</InfoBox>
      <SearchBox />
    </App>
  );
};

export default IndexPage;
