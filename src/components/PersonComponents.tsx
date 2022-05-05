import React from "react";
import { useQuery, UseQueryResult } from "react-query";
import { fetchPerson } from "../../pages/person";
import { IPerson } from "../lib/interfaces/IPerson";

function PersonComponents() {
  const {
    status,
    isLoading,
    isError,
    error,
    data,
  }: UseQueryResult<IPerson, Error> = useQuery<IPerson, Error, IPerson, string>(
    "person",
    fetchPerson
  );
  return (
    <>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
      <p>{data?.age}</p>
    </>
  );
}

export default PersonComponents;
