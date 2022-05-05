import React, { FC } from "react";
import { GetServerSideProps } from "next";
import { UseQueryResult, useQuery } from "react-query";
import { IPerson } from "@src/lib/interfaces/IPerson";

const fetchPerson = async (): Promise<IPerson> => {
  const res = await fetch(`/api/person`);
  // need to do this with fetch since doesn't automatically throw errors axios and graphql-request do
  if (res.ok) {
    return res.json();
  }
  throw new Error("Network response not ok"); // need to throw because react-query functions need to have error thrown to know its in error state
};

interface InitialDataExamplePageProps {
  person: IPerson;
}

const InitialDataExamplePage: FC<InitialDataExamplePageProps> = ({
  person,
}: InitialDataExamplePageProps) => {
  const { isLoading, isError, error, data }: UseQueryResult<IPerson, Error> =
    useQuery<IPerson, Error>("person", fetchPerson, { initialData: person });

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
  if (isError) return <p>Boom boy: Error is -- {error?.message}</p>;

  return (
    <>
      <h1>Person</h1>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
      <p>{data?.age}</p>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: { person: IPerson };
}> => {
  // const person = await fetchPerson();
  const person = await fetch("http://localhost:3000/api/person").then((res) =>
    res.json()
  );
  return { props: { person } };
};

export default InitialDataExamplePage;
