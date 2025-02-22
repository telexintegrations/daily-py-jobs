import { Request, Response } from "express";
import axios from "axios";
import { jobLocations } from "./data";
import { IJobQuery, ITelexSettings, IJobQuerySettings } from "./interfaces";

export const getNewJobs = async (settings: {
  prefered_framework: string;
  location: string;
  experience_level: string;
  employment_type: string;
}) => {
  const { location, experience_level, employment_type, prefered_framework } =
    settings;
  const url = process.env.CORESIGNAL_API_SEARCH_URL;
  if (!url) {
    throw new Error(
      "App.Service.getNewJobs ---> CORESIGNAL_API_SEARCH_URL is not set"
    );
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CORESIGNAL_API_KEY}`,
  };

  // jobs post from yesterday 9am and above
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(9, 0, 0, 0);

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  const baseQuery: IJobQuery = {
    title: "Python",
    created_at_gte: formatDate(yesterday),
    application_active: true,
  };

  if (prefered_framework !== "all_frameworks") {
    baseQuery["title"] = `${baseQuery["title"]} OR ${prefered_framework}`;
    baseQuery["keyword_description"] = prefered_framework;
  }

  if (location !== "all_locations") {
    baseQuery["location"] = location;
  }

  if (experience_level !== "all_levels") {
    baseQuery["seniority"] = experience_level;
  }

  if (employment_type !== "all_types") {
    baseQuery["employment_type"] = employment_type;
  }

  try {
    const response = await axios.post(url, baseQuery, { headers });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("App.Service.getNewJobs --->", error.message);
    } else {
      console.error("App.Service.getNewJobs --->", error);
    }
    return null;
  }
};

export const getNewJob = async (jobID: string) => {
  const url = process.env.CORESIGNAL_API_COLLECTION_URL + jobID;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CORESIGNAL_API_KEY}`,
  };

  try {
    const response = await axios.get(url, { headers });
    const data = response.data;

    const jobDetails = {
      title: data.title,
      description: data.description,
      location: data.location,
      experienceLevel: data.seniority,
      employmentType: data.employment_type,
      salary: data.salary,
      company: data.company_name,
      createdAt: data.created,
      jobPostUrl: data.url,
      applicationUrl: data.external_url,
    };

    return jobDetails;
  } catch (error) {
    if (error instanceof Error) {
      console.error("App.service.getNewJob ---> ", error.message);
    } else {
      console.error("App.Service.getNewJob --->", error);
    }
    return null;
  }
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const handleJobs = async (
  return_url: string,
  settings: IJobQuerySettings
) => {
  const jobs = await getNewJobs(settings);

  if (jobs.length === 0) {
    const responseData = {
      message:
        "No new jobs today ☹️. Please check in tomorrow or modify your app settings.",
      username: "Daily Python Jobs",
      event_name: "New Job Alert",
      status: "success",
    };

    return axios.post(return_url, responseData);
  }

  // get the first ten jobs ids
  const topJobs = jobs.slice(0, 10);

  for (const job of topJobs) {
    const jobDetails = await getNewJob(job);

    const message = `🔔 ${jobDetails?.title} at ${jobDetails?.company}\n\nDescription: ${jobDetails?.description}\n\nLocation: ${jobDetails?.location}\n\nExperience Level: ${jobDetails?.experienceLevel}\n\nEmployment Type: ${jobDetails?.employmentType}\n\nSalary: ${jobDetails?.salary}\n\nView Job Post: ${jobDetails?.jobPostUrl}\n\nApply Here: ${jobDetails?.applicationUrl}`;

    const data = {
      message,
      username: "Daily Python Jobs",
      event_name: "New Job Alert",
      status: "success",
    };

    axios.post(return_url, data);
    sleep(5000); // sleep for 5 seconds to avoid telex rate limiting
  }
};

export const telexWebhook = async (req: Request, res: Response) => {
  const { return_url, settings } = req.body;

  const settingsObject = settings.reduce(
    (acc: Record<string, string>, setting: ITelexSettings) => {
      acc[setting.label.toLowerCase().split(" ").join("_")] = setting.default
        .toLowerCase()
        .split(" ")
        .join("_");
      return acc;
    },
    {} as Record<string, string>
  );

  handleJobs(return_url, settingsObject);

  res.status(202).json({ status: "accepted" });
};

export const telexConfig = async (req: Request, res: Response) => {
  const responseData = {
    data: {
      date: {
        created_at: "2025-02-20",
        updated_at: "2025-02-20",
      },
      descriptions: {
        app_name: "Daily Python Jobs",
        app_description:
          "This integration sends the latest python jobs everyday",
        app_logo:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1280px-Python-logo-notext.svg.png",
        app_url: "https://daily-py-jobs-cf03a679f137.herokuapp.com/",
        background_color: "#fff",
      },
      integration_category: "Task Automation",
      is_active: true,
      integration_type: "interval",
      key_features: ["Python Jobs Everyday"],
      author: "iConnell",
      settings: [
        {
          label: "interval",
          type: "text",
          required: true,
          default: "0 9 * * *",
        },
        {
          label: "Location",
          type: "dropdown",
          required: false,
          default: "All Locations",
          options: jobLocations,
        },
        {
          label: "Experience Level",
          type: "dropdown",
          required: false,
          default: "All Levels",
          options: ["All Levels", "Entry", "Associate", "Mid", "Senior"],
        },
        {
          label: "Employment Type",
          type: "dropdown",
          required: false,
          default: "All Types",
          options: ["All Types", "Full-time", "Part-time", "Contract"],
        },

        {
          label: "Prefered Framework",
          type: "dropdown",
          required: true,
          default: "All Frameworks",
          options: ["All Frameworks", "Django", "Flask", "Fastapi"],
        },
      ],
      target_url: "https://target.url",
      tick_url: "https://daily-py-jobs-cf03a679f137.herokuapp.com/jobs",
    },
  };

  res.status(200).json(responseData);
};
