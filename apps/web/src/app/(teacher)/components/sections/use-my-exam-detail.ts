"use client";

import { useQuery } from "@apollo/client/react";
import {
  MyExamDetailQueryDocument,
  type MyExamDetailQueryQuery,
  type MyExamDetailQueryQueryVariables,
} from "@/graphql/generated";
import type { MyExamListView } from "./my-exams-types";
import { buildMyExamDetailView } from "./my-exams-view-model";

export function useMyExamDetail(exam: MyExamListView | null, enabled: boolean) {
  const { data, loading, error } = useQuery<
    MyExamDetailQueryQuery,
    MyExamDetailQueryQueryVariables
  >(MyExamDetailQueryDocument, {
    variables: { id: exam?.id ?? "" },
    skip: !enabled || !exam,
    fetchPolicy: "cache-first",
  });

  const detailExam = data?.exam ? buildMyExamDetailView(data.exam) : null;

  return { detailExam, loading, error };
}
