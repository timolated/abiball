import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
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
