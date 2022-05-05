import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { IPerson } from "../../src/lib/interfaces/IPerson";

const getPersonById = async (
  id: string | string[] | undefined
): Promise<IPerson> => {
  if (typeof id === "string") {
    const res = await fetch(`/api/person/${id}`);

    if (res.ok) {
      return res.json();
    }
    throw new Error("error fetchs");
  }
  throw new Error("invalid id");
};
const PersonPage: FC = () => {
  const {
    query: { id },
  } = useRouter();
  const { isLoading, isError, error, data } = useQuery<IPerson, Error>(
    ["person", id],
    () => getPersonById(id),
    {
      //id가 있을 경우에만 호출하려고 사용
      enabled: !!id,
    }
  );

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) return <p>error {error?.message}</p>;
  return (
    <>
      <Link href="/">
        <a>home</a>
      </Link>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
      <p>{data?.age}</p>
    </>
  );
};

export default PersonPage;
