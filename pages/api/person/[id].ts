// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { IPerson } from "../../../src/lib/interfaces/IPerson";

// eslint-disable-next-line import/no-anonymous-default-export
export default (
  _req: NextApiRequest,
  res: NextApiResponse<IPerson | Error>
): void => {
  const {
    query: { id },
  } = _req;

  if (typeof id === "string") {
    console.log(`getting person by id: ${id}`);
    res.status(200).json({ id, name: "jone roen", age: 25 });
  } else {
    res.status(500).json(new Error("id not ~"));
  }
};
