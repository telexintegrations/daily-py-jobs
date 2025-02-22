"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.telexConfig = exports.postJobs = exports.handleJobs = exports.getNewJob = exports.getNewJobs = void 0;
const axios_1 = __importDefault(require("axios"));
const data_1 = require("./data");
const getNewJobs = (settings) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, experience_level, employment_type, prefered_framework } = settings;
    const url = process.env.CORESIGNAL_API_SEARCH_URL;
    if (!url) {
        throw new Error("App.Service.getNewJobs ---> CORESIGNAL_API_SEARCH_URL is not set");
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
    const formatDate = (date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    };
    const baseQuery = {
        title: "Python",
        created_at_gte: formatDate(yesterday),
        application_active: true,
    };
    if (prefered_framework !== "all_frameworks") {
        baseQuery["title"] = `${baseQuery["title"]} OR ${prefered_framework}`;
        baseQuery["description"] = prefered_framework;
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
    console.log(baseQuery);
    try {
        const response = yield axios_1.default.post(url, baseQuery, { headers });
        return response.data;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("App.Service.getNewJobs --->", error.message);
        }
        else {
            console.error("App.Service.getNewJobs --->", error);
        }
        return null;
    }
});
exports.getNewJobs = getNewJobs;
const getNewJob = (jobID) => __awaiter(void 0, void 0, void 0, function* () {
    const url = process.env.CORESIGNAL_API_COLLECTION_URL + jobID;
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CORESIGNAL_API_KEY}`,
    };
    try {
        const response = yield axios_1.default.get(url, { headers });
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("App.service.getNewJob ---> ", error.message);
        }
        else {
            console.error("App.Service.getNewJob --->", error);
        }
        return null;
    }
});
exports.getNewJob = getNewJob;
const handleJobs = (return_url, settings) => __awaiter(void 0, void 0, void 0, function* () {
    const jobs = yield (0, exports.getNewJobs)(settings);
    if (!jobs) {
        const responseData = {
            message: "No new jobs matching your criteria found, check in again tomorrow or modify your settings.",
            username: "Daily Python Jobs",
            event_name: "Daily Python Jobs",
            status: "error",
        };
        return axios_1.default.post(return_url, responseData);
    }
    // get the first ten jobs ids
    const topJobs = jobs.slice(0, 10);
    for (const job of topJobs) {
        const jobDetails = yield (0, exports.getNewJob)(job.id);
        const message = `New Job Alert: 🔔${jobDetails === null || jobDetails === void 0 ? void 0 : jobDetails.title} at ${jobDetails === null || jobDetails === void 0 ? void 0 : jobDetails.company}\n\nDescription: ${jobDetails === null || jobDetails === void 0 ? void 0 : jobDetails.description}\n\nLocation: ${jobDetails === null || jobDetails === void 0 ? void 0 : jobDetails.location}\n\nExperience Level: ${jobDetails === null || jobDetails === void 0 ? void 0 : jobDetails.experienceLevel}\n\nEmployment Type: ${jobDetails === null || jobDetails === void 0 ? void 0 : jobDetails.employmentType}\n\nSalary: ${jobDetails === null || jobDetails === void 0 ? void 0 : jobDetails.salary}\n\nJob Post URL: ${jobDetails === null || jobDetails === void 0 ? void 0 : jobDetails.jobPostUrl}\n\nApplication URL: ${jobDetails === null || jobDetails === void 0 ? void 0 : jobDetails.applicationUrl}`;
        const data = {
            message,
            username: "Daily Python Jobs",
            event_name: "Daily Python Jobs",
            status: "success",
        };
        axios_1.default.post(return_url, data);
    }
});
exports.handleJobs = handleJobs;
const postJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { return_url, settings } = req.body;
    const settingsObject = settings.reduce((acc, setting) => {
        acc[setting.label.toLowerCase().split(" ").join("_")] = setting.default
            .toLowerCase()
            .split(" ")
            .join("_");
        return acc;
    }, {});
    (0, exports.handleJobs)(return_url, settingsObject);
    res.status(202).json({ status: "accepted" });
});
exports.postJobs = postJobs;
const telexConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseData = {
        data: {
            date: {
                created_at: "2025-02-20",
                updated_at: "2025-02-20",
            },
            descriptions: {
                app_name: "Daily Python Jobs",
                app_description: "This integration sends the latest python jobs everyday",
                app_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1280px-Python-logo-notext.svg.png",
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
                    default: "* * * * *",
                },
                {
                    label: "Location",
                    type: "dropdown",
                    required: false,
                    default: "All Locations",
                    options: data_1.jobLocations,
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
            tick_url: "https://daily-py-jobs-cf03a679f137.herokuapp.com/telex/jobs",
        },
    };
    res.status(200).json(responseData);
});
exports.telexConfig = telexConfig;
