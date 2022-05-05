// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { IPerson } from "../../../src/lib/interfaces/IPerson";

// eslint-disable-next-line import/no-anonymous-default-export
export default (_req: NextApiRequest, res: NextApiResponse<IPerson>): void => {
  console.log("getting person");
  const data: IPerson = JSON.parse(_req.body);
  res.status(200).json(data);
};
