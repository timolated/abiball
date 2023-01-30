import { type NextPage } from "next";
import { useRouter } from "next/router";
import CategoryView from "./categoryView";
import CategoryOverview from "./overview";

const DrinkPage: NextPage = () => {
  const router = useRouter();
  const category = router.query.category;
  return (
    <>
      {!category && <CategoryOverview />}
      {category && <CategoryView categoryId={category.toString()} />}
    </>
  );
};

export default DrinkPage;
