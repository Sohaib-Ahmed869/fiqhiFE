// src/pages/NewApplication.jsx
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import lanterns from "../../assets/lanterns.png";
import s1 from "../../assets/services/s1.png";
import s2 from "../../assets/services/s2.png";
import s3 from "../../assets/services/s3.png";
import s4 from "../../assets/services/s4.png";
import api from "../../utils/api";

const ApplicationCard = ({ title, arabicTitle, icon, to }) => {
  return (
    <Link
      to={to}
      className="bg-white rounded-xl p-8 shadow hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center space-y-6"
    >
      <img src={icon} alt="" className="h-32 lg:h-44" />
      {/* <div className="text-center space-y-1">
        <div className="text-teal-600 font-arabic text-lg">{arabicTitle}</div>
        <div className="text-gray-700 text-sm">{title}</div>
      </div> */}
    </Link>
  );
};

const QueryProgressCard = () => {
  const [latestApplication, setLatestApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        // Fetch all user applications from different services
        const [marriageRes, reconciliationRes, fatwaRes] = await Promise.all([
          api.get("/marriages/my-marriages"),
          api.get("/reconciliations/my-cases"),
          api.get("/fatwas/user"),
        ]);

        // Combine all applications
        const allApplications = [
          ...marriageRes.data.marriages.map((item) => ({
            ...item,
            applicationType: "marriage",
            date: new Date(item.createdAt),
          })),
          ...reconciliationRes.data.reconciliations.map((item) => ({
            ...item,
            applicationType: "reconciliation",
            date: new Date(item.createdAt),
          })),
          ...fatwaRes.data.fatwas.map((item) => ({
            ...item,
            applicationType: "fatwa",
            date: new Date(item.createdAt),
          })),
        ];

        // Sort by date descending to get the most recent
        allApplications.sort((a, b) => b.date - a.date);

        // Set the latest application if exists
        if (allApplications.length > 0) {
          setLatestApplication(allApplications[0]);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load your latest application");
      } finally {
        setLoading(false);
      }
    };

    fetchUserApplications();
  }, []);

  // Early returns for loading and error states
  if (loading) {
    return (
      <div className="mt-12 flex rounded-xl border border-gray-200 overflow-hidden shadow-md">
        <div className="flex-1 p-6 bg-white">
          <p className="text-gray-600">Loading your latest application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 flex rounded-xl border border-gray-200 overflow-hidden shadow-md bg-red-50">
        <div className="flex-1 p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!latestApplication) {
    return (
      <div className="mt-12 flex rounded-xl border border-gray-200 overflow-hidden shadow-md">
        <div className="flex-1 p-6 bg-white">
          <p className="text-gray-600">
            You don't have any active applications.
          </p>
        </div>
      </div>
    );
  }

  // Calculate progress based on application type and status
  const getProgressInfo = () => {
    switch (latestApplication.applicationType) {
      case "marriage":
        return getMarriageProgress(latestApplication);
      case "reconciliation":
        return getReconciliationProgress(latestApplication);
      case "fatwa":
        return getFatwaProgress(latestApplication);
      default:
        return {
          title: "Unknown Application",
          queryNumber: "N/A",
          progress: 0,
          totalSteps: 1,
          nextStep: "Contact administrator",
          nextStepDescription:
            "There was an issue determining your application type",
          actionText: "Contact Support",
          actionLink: "/contact",
        };
    }
  };

  const getMarriageProgress = (marriage) => {
    const totalSteps = 4;
    let progress = 0;
    let nextStep = "";
    let nextStepDescription = "";

    if (marriage.status === "pending") {
      progress = 1;
      nextStep = "Awaiting Assignment";
      nextStepDescription =
        "Your application is under review and will be assigned to a Shaykh soon";
    } else if (marriage.status === "assigned") {
      progress = 2;
      nextStep = "Schedule Meeting with Shaykh";
      nextStepDescription =
        "Please schedule your consultation to discuss your marriage query and requirements";
    } else if (marriage.status === "in-progress") {
      progress = 3;
      nextStep = "Attend Scheduled Meetings";
      nextStepDescription =
        "Follow up on the scheduled meetings with the assigned Shaykh";
    } else if (marriage.status === "completed") {
      progress = 4;
      nextStep = "Process Completed";
      nextStepDescription =
        "Your marriage application has been successfully processed";
    }

    return {
      title:
        marriage.type === "reservation"
          ? "Marriage Reservation"
          : "Marriage Certificate",
      queryNumber: `MQ-${new Date(
        marriage.createdAt
      ).getFullYear()}-${marriage._id.slice(-3)}`,
      progress,
      totalSteps,
      nextStep,
      nextStepDescription,
      actionText: progress < totalSteps ? "Continue Process" : "View Details",
      actionLink: `/user/marriage-queries/${marriage._id}`,
    };
  };

  const getReconciliationProgress = (reconciliation) => {
    const totalSteps = 4;
    let progress = 0;
    let nextStep = "";
    let nextStepDescription = "";

    if (reconciliation.status === "pending") {
      progress = 1;
      nextStep = "Awaiting Assignment";
      nextStepDescription =
        "Your case is under review and will be assigned to a Shaykh soon";
    } else if (reconciliation.status === "assigned") {
      progress = 2;
      nextStep = "Schedule Consultation";
      nextStepDescription =
        "Please schedule your first consultation to discuss your family reconciliation case";
    } else if (reconciliation.status === "in-progress") {
      progress = 3;
      nextStep = "Follow Reconciliation Process";
      nextStepDescription =
        "Continue with the reconciliation process as advised by the Shaykh";
    } else if (
      reconciliation.status === "resolved" ||
      reconciliation.status === "unresolved"
    ) {
      progress = 4;
      nextStep = "Process Completed";
      nextStepDescription =
        reconciliation.status === "resolved"
          ? "Your reconciliation case has been successfully resolved"
          : "Your reconciliation case has been marked as unresolved";
    }

    return {
      title: "Family Reconciliation",
      queryNumber: `RC-${new Date(
        reconciliation.createdAt
      ).getFullYear()}-${reconciliation._id.slice(-3)}`,
      progress,
      totalSteps,
      nextStep,
      nextStepDescription,
      actionText: progress < totalSteps ? "Continue Process" : "View Details",
      actionLink: `/user/reconciliation-queries/${reconciliation._id}`,
    };
  };

  const getFatwaProgress = (fatwa) => {
    const totalSteps = 3;
    let progress = 0;
    let nextStep = "";
    let nextStepDescription = "";

    if (fatwa.status === "pending") {
      progress = 1;
      nextStep = "Under Review";
      nextStepDescription =
        "Your question is being reviewed and will be assigned to a Shaykh soon";
    } else if (fatwa.status === "assigned") {
      progress = 2;
      nextStep = "Awaiting Answer";
      nextStepDescription =
        "Your question has been assigned to a Shaykh and is being researched";
    } else if (fatwa.status === "answered" || fatwa.status === "approved") {
      progress = 3;
      nextStep = "Answer Available";
      nextStepDescription = "The answer to your question is now available";
    }

    return {
      title: "Fatwa Query",
      queryNumber: `FQ-${new Date(
        fatwa.createdAt
      ).getFullYear()}-${fatwa._id.slice(-3)}`,
      progress,
      totalSteps,
      nextStep,
      nextStepDescription,
      actionText: progress < totalSteps ? "Check Status" : "View Answer",
      actionLink: `/user/fatwa-queries`,
    };
  };

  const {
    title,
    queryNumber,
    progress,
    totalSteps,
    nextStep,
    nextStepDescription,
    actionText,
    actionLink,
  } = getProgressInfo();

  const progressPercentage = (progress / totalSteps) * 100;

  return (
    <div className="mt-12 flex flex-col md:flex-row rounded-xl border border-gray-200 overflow-hidden shadow-md">
      {/* Left Section */}
      <div className="flex-1 p-6 bg-white">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Query #{queryNumber}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
            <span className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
              Active
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Progress ({progress} of {totalSteps} steps completed)
            </p>
            <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-700 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-80 bg-gray-50 p-6 flex flex-col justify-between">
        <div>
          <p className="text-sm text-gray-600">Next Step:</p>
          <h3 className="text-base font-medium text-gray-900">{nextStep}</h3>
          <p className="mt-1 text-sm text-gray-500">{nextStepDescription}</p>
        </div>
        <Link
          to={actionLink}
          className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          {actionText}
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

const NewApplication = () => {
  const applications = [
    {
      title: "Islamic Marriage Office",
      arabicTitle: "مكتب الزواج الشرعي",
      icon: s1,
      to: "/user/new-marriage", // Updated path to new marriage screen
    },
    {
      title: "Family Reconciliation Office",
      arabicTitle: "مكتب الإصلاح الأسري",
      icon: s2,
      to: "/user/new-reconciliation", // Updated path to new reconciliation screen
    },
    {
      title: "Islamic Fatawa Centre",
      arabicTitle: "مركز الفتاوى الشرعية",
      icon: s3,
      to: "/user/new-fatwa", // Updated path to new fatwa screen
    },
    {
      title: "Islamic and Arabic Education Centre",
      arabicTitle: "مركز العلوم الشرعية والعربية",
      icon: s4,
      to: "#", // Placeholder path for the education center (not implemented yet)
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-8">
      <div className="max-w-7xl w-full">
        {/* Decorative Lanterns */}
        <div className="absolute right-0 top-0">
          <img src={lanterns} alt="" className="w-64" />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Select your new application
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Select the application that you want to proceed with
          </p>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {applications.map((app, index) => (
            <ApplicationCard
              key={index}
              title={app.title}
              arabicTitle={app.arabicTitle}
              icon={app.icon}
              to={app.to}
            />
          ))}
        </div>

        {/* Active Query Progress */}
        <QueryProgressCard />
      </div>
    </div>
  );
};

export default NewApplication;
