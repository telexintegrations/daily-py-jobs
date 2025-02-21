import { Request, Response } from "express";

export const getJobs = async (req: Request, res: Response) => {
  const sampleJobs = [
    {
      title: "Python Developer",
      company: "Google",
      location: "Remote",
      salary: "$100,000",
      description: "Python Developer needed at Google",
      date: "2021-09-01",
    },
    {
      title: "Python Developer",
      company: "Facebook",
      location: "Remote",
      salary: "$100,000",
      description: "Python Developer needed at Facebook",
      date: "2021-09-01",
    },
    {
      title: "Python Developer",
      company: "Amazon",
      location: "Remote",
      salary: "$100,000",
      description: "Python Developer needed at Amazon",
      date: "2021-09-01",
    },
    {
      title: "Python Developer",
      company: "Netflix",
      location: "Remote",
      salary: "$100,000",
      description: "Python Developer needed at Netflix",
      date: "2021-09-01",
    },
  ];

  res.status(200).json(sampleJobs);
};
