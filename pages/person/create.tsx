import React, { FormEventHandler, useState, FC } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { fetchPerson } from ".";
import { IPerson } from "../../src/lib/interfaces/IPerson";

const createPerson = async (
  id: string,
  name: string,
  age: number
): Promise<IPerson> => {
  const res: Response = await fetch("/api/person/create", {
    method: "POST",
    body: JSON.stringify({
      id,
      name,
      age,
    }),
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error("Error");
};

interface ICreatePersonParams {
  id: string;
  name: string;
  age: string;
}

interface IContext {
  previousPerson: IPerson | undefined;
}

const CreatePage: FC = () => {
  const [enabled, setEnabled] = useState(false);
  const { data: queryData }: UseQueryResult<IPerson, Error> = useQuery<
    IPerson,
    Error
  >("person", fetchPerson, {
    enabled,
  });

  const queryClient = useQueryClient();

  const mutation: UseMutationResult<IPerson, Error, ICreatePersonParams> =
    useMutation<IPerson, Error, ICreatePersonParams, IContext | undefined>(
      async ({ id, name, age }) => createPerson(id, name, age),
      {
        // before mutation
        onMutate: async (_variables: ICreatePersonParams) => {
          // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
          await queryClient.cancelQueries("person");

          // Snapshot the previous value
          const previousPerson: IPerson | undefined =
            queryClient.getQueryData("person");

          const newPerson: IPerson = {
            id: "123",
            age: 200,
            name: "Lebron James",
          };

          // optimistically update
          queryClient.setQueryData("person", newPerson);

          // Return a context object with the snapshotted value
          return { previousPerson };
        },
        // on success of mutation
        onSuccess: (
          data: IPerson,
          _variables: ICreatePersonParams,
          _context: IContext | undefined
        ) => {
          queryClient.invalidateQueries("person");
          //   queryClient.setQueryData('person', data);
          return console.log("mutation data", data);
        },
        // if mutation errors
        onError: (
          error: Error,
          _variables: ICreatePersonParams,
          context: IContext | undefined
        ) => {
          console.log("error: ", error.message);
          queryClient.setQueryData("person", context?.previousPerson);
          return console.log(
            `rolling back optimistic update with id: ${context?.previousPerson?.id}`
          );
        },
        // no matter if error or success run me
        onSettled: (
          _data: IPerson | undefined,
          _error: Error | null,
          _variables: ICreatePersonParams | undefined,
          _context: IContext | undefined
        ) => {
          return console.log("complete mutation!");
        },
      }
    );

  const onSubmit: FormEventHandler<HTMLFormElement> = async (
    event: React.SyntheticEvent
  ) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      name: { value: string };
      age: { value: number };
    };
    const id = "1";
    const name = target.name.value;
    const age = target.age.value;
    mutation.mutate({ id, name, age });
  };

  return (
    <>
      {mutation.isLoading ? (
        <p>Adding todo</p>
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation?.error?.message}</div>
          ) : null}

          {mutation.isSuccess ? (
            <div>
              Todo added! Person name is {mutation?.data?.name} and he is{" "}
              {mutation?.data?.age}
            </div>
          ) : null}
        </>
      )}

      <button
        type="button"
        onClick={() => {
          setEnabled(!enabled);
          queryClient.invalidateQueries("person");
        }}
      >
        Invalidate Cache
      </button>

      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name:</label>
        <br />
        <input type="text" id="name" name="name" />
        <br />
        <label htmlFor="age">Age:</label>
        <br />
        <input type="number" id="age" name="age" />
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form>

      {queryData && (
        <>
          <h1>Person is</h1>
          <p>Name: {queryData?.name}</p>
          <p>Age: {queryData?.age}</p>
        </>
      )}
    </>
  );
};

export default CreatePage;
