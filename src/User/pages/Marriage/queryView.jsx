// src/pages/MarriageApplicationView.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import shaykh from "../../../assets/shaykh.png";
import googleCalendar from "../../../assets/googleCalendar.png";
import certificate from "../../../assets/certificate.png";
import marriageService from "../../services/marriageServices";
import { format } from "date-fns";
import ConvertIDtoSmallID from "../../../utils/IDconversion";

const FieldGroup = ({ label, value }) => (
  <div>
    <label className="text-sm text-green-700">{label}</label>
    <input
      type="text"
      value={value}
      readOnly
      className="mt-1 w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700"
    />
  </div>
);

// Replace the existing DownloadCertificate component with this enhanced version
const DownloadCertificate = ({ marriage }) => {
  console.log(marriage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAndDownloadCertificate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Import libraries dynamically
      const { jsPDF } = await import("jspdf");

      // Initialize the PDF document (landscape)
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Set page background color (slight cream)
      doc.setFillColor(252, 252, 250);
      doc.rect(
        0,
        0,
        doc.internal.pageSize.width,
        doc.internal.pageSize.height,
        "F"
      );

      // Add border
      doc.setDrawColor(44, 62, 80);
      doc.setLineWidth(1);
      doc.rect(
        10,
        10,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 20,
        "S"
      );

      // Add title with proper styling
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(44, 62, 80);
      doc.text(
        "ISLAMIC MARRIAGE CERTIFICATE",
        doc.internal.pageSize.width / 2,
        30,
        { align: "center" }
      );

      // Add certificate number and date
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Certificate No: ${marriage.certificateNumber}`,
        doc.internal.pageSize.width / 2,
        40,
        { align: "center" }
      );
      doc.text(
        `Issue Date: ${format(
          new Date(marriage.certificateIssuedDate || new Date()),
          "MMMM d, yyyy"
        )}`,
        doc.internal.pageSize.width / 2,
        47,
        { align: "center" }
      );

      // Add decorative line
      doc.setDrawColor(44, 62, 80);
      doc.setLineWidth(0.5);
      doc.line(50, 70, doc.internal.pageSize.width - 50, 70);

      // Certificate content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text("This is to certify that", doc.internal.pageSize.width / 2, 85, {
        align: "center",
      });

      // Partner names
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${marriage.partnerOne.firstName} ${marriage.partnerOne.lastName}`,
        doc.internal.pageSize.width / 2,
        100,
        { align: "center" }
      );

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("and", doc.internal.pageSize.width / 2, 110, {
        align: "center",
      });

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${marriage.partnerTwo.firstName} ${marriage.partnerTwo.lastName}`,
        doc.internal.pageSize.width / 2,
        120,
        { align: "center" }
      );

      // Marriage details
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(
        "have been lawfully married according to Islamic Law (Shariah)",
        doc.internal.pageSize.width / 2,
        135,
        { align: "center" }
      );
      doc.text(
        `on ${format(new Date(marriage.marriageDate), "MMMM d, yyyy")}`,
        doc.internal.pageSize.width / 2,
        145,
        { align: "center" }
      );
      doc.text(
        `at ${marriage.marriagePlace}`,
        doc.internal.pageSize.width / 2,
        155,
        { align: "center" }
      );

      // Officiant (Shaykh) section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("OFFICIATED BY", doc.internal.pageSize.width / 2, 165, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${marriage.assignedShaykh.firstName} ${marriage.assignedShaykh.lastName}`,
        doc.internal.pageSize.width / 2,
        175,
        { align: "center" }
      );

      // Add another decorative line
      doc.setLineWidth(0.5);
      doc.line(50, 215, doc.internal.pageSize.width - 50, 215);

      // Add signature lines
      const signatureY = 230;

      // Shaykh signature
      doc.line(70, signatureY, 120, signatureY);
      doc.text("Shaykh Signature", 95, signatureY + 7, { align: "center" });

      // Official seal
      doc.line(
        doc.internal.pageSize.width - 120,
        signatureY,
        doc.internal.pageSize.width - 70,
        signatureY
      );
      doc.text(
        "Official Seal",
        doc.internal.pageSize.width - 95,
        signatureY + 7,
        { align: "center" }
      );

      // Add footer
      const footerY = doc.internal.pageSize.height - 20;

      doc.setFontSize(10);
      doc.text(
        "This certificate is an official document recognized by our Islamic institution.",
        doc.internal.pageSize.width / 2,
        footerY,
        { align: "center" }
      );
      doc.text(
        "May Allah bless this union and grant the couple happiness and prosperity.",
        doc.internal.pageSize.width / 2,
        footerY + 5,
        { align: "center" }
      );

      // Save the PDF with a specific name
      doc.save(`marriage-certificate-${marriage?.certificateNumber}.pdf`);
    } catch (err) {
      console.error("Error generating certificate:", err);
      setError("Failed to generate certificate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-gray-900">Marriage Certificate</h4>
            <p className="text-sm text-gray-600">
              {marriage?.certificateNumber
                ? `Certificate #${marriage.certificateNumber}`
                : "Your certificate is ready"}
            </p>
          </div>
          <img src={certificate} alt="Certificate" className="h-16" />
        </div>
        <button
          onClick={generateAndDownloadCertificate}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download Certificate</span>
            </>
          )}
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

const TimelineEntry = ({ date, title }) => (
  <div className="flex items-start gap-3 mb-4">
    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-green-500" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{date}</p>
      <p className="text-sm">{title}</p>
    </div>
  </div>
);

const Timeline = ({ marriage }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "EEEE, dd MMM yyyy");
  };

  return (
    <div className="mt-8">
      <TimelineEntry
        date={formatDate(marriage.createdAt)}
        title="Application Submitted"
      />

      {marriage.assignedShaykh && (
        <TimelineEntry
          date={formatDate(marriage.updatedAt)}
          title={`Application Assigned to ${marriage.assignedShaykh.firstName} ${marriage.assignedShaykh.lastName}`}
        />
      )}

      {marriage.meetings &&
        marriage.meetings.map((meeting, index) => (
          <TimelineEntry
            key={index}
            date={formatDate(meeting.date)}
            title={
              meeting.status === "scheduled"
                ? "Meeting Scheduled"
                : `Meeting ${meeting.status}`
            }
          />
        ))}

      {marriage.certificateIssuedDate && (
        <TimelineEntry
          date={formatDate(marriage.certificateIssuedDate)}
          title="Certificate Issued"
        />
      )}

      {marriage.status === "completed" && !marriage.certificateIssuedDate && (
        <TimelineEntry
          date={formatDate(marriage.updatedAt)}
          title="Application Completed"
        />
      )}
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <div className="bg-green-50 px-4 py-2 mb-4">
    <h3 className="text-green-800 font-medium">{children}</h3>
  </div>
);

const ScheduleMeetingBanner = ({ marriage, onScheduleMeeting }) => (
  <div className="bg-[#B89360] text-white p-6 rounded-lg mb-6">
    <div className="flex items-start">
      <div className="flex-1">
        <img src={shaykh} alt="Shaykh" className="w-8" />
        <p className="text-sm opacity-90">To Proceed with your application</p>
        <h3 className="text-xl font-medium mt-1">
          Kindly Schedule a meeting with Shaykh
          {marriage.assignedShaykh &&
            ` ${marriage.assignedShaykh.firstName} ${marriage.assignedShaykh.lastName}`}
        </h3>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <img
              src={googleCalendar}
              alt="Google Calendar"
              className="h-6 mr-2"
            />
            Add Meeting to Google Calendar?
          </div>
          <button
            onClick={onScheduleMeeting}
            className="px-4 py-1 border border-white rounded text-sm hover:bg-white hover:text-[#B69B7A] transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  </div>
);

const MeetingList = ({ meetings }) => {
  if (!meetings || meetings.length === 0) return null;

  return (
    <div className="mt-6 border rounded-lg overflow-hidden">
      <h4 className="font-medium p-3 bg-gray-50 border-b">
        Scheduled Meetings
      </h4>
      <div className="divide-y">
        {meetings.map((meeting, index) => (
          <div key={index} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">
                  {format(new Date(meeting.date), "MMMM d, yyyy")} at{" "}
                  {meeting.time}
                </p>
                <p className="text-sm text-gray-600">{meeting.location}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full uppercase font-medium ${
                  meeting.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : meeting.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : meeting.status === "rescheduled"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {meeting.status}
              </span>
            </div>
            {meeting.notes && (
              <p className="text-sm text-gray-600 mt-1">{meeting.notes}</p>
            )}
            {meeting.completedNotes && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <span className="font-medium">Meeting notes:</span>{" "}
                {meeting.completedNotes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FeedbackSection = ({ feedbacks, onAddFeedback }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFeedback(comment);
    setComment("");
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <h4 className="font-medium mb-4">Communication</h4>

      <div className="space-y-4 mb-4">
        {feedbacks && feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">
                  {feedback.user.firstName || feedback.user.username}
                  {feedback.user.role === "shaykh" && " (Shaykh)"}
                  {feedback.user.role === "admin" && " (Admin)"}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(feedback.date), "MMM d, yyyy h:mm a")}
                </span>
              </div>
              <p className="text-sm">{feedback.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No messages yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          placeholder="Ask a question or provide additional information..."
          rows={3}
          required
        ></textarea>
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={!comment.trim()}
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

const ScheduleMeetingModal = ({ onClose, onSchedule, marriage }) => {
  const [meetingData, setMeetingData] = useState({
    date: "",
    time: "",
    location: marriage?.preferredLocation || "",
    notes: "",
  });

  const handleChange = (e) => {
    setMeetingData({
      ...meetingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule(meetingData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Schedule a Meeting
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={meetingData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={meetingData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={meetingData.location}
                onChange={handleChange}
                placeholder="e.g., Local Masjid, Home address, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={meetingData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any additional details..."
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MarriageApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marriage, setMarriage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  useEffect(() => {
    fetchMarriage();
  }, [id]);

  const fetchMarriage = async () => {
    try {
      setLoading(true);
      const response = await marriageService.getMarriage(id);
      setMarriage(response.data.marriage);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch marriage details. Please try again.");
      console.error("Error fetching marriage:", err);
      setLoading(false);
    }
  };

  const handleScheduleMeeting = (meetingData) => {
    marriageService
      .addMeeting(marriage._id, meetingData)
      .then((response) => {
        setMarriage(response.data.marriage);
        setIsScheduleModalOpen(false);
      })
      .catch((err) => {
        console.error("Error scheduling meeting:", err);
        alert("Failed to schedule meeting. Please try again.");
      });
  };

  const handleAddFeedback = (comment) => {
    marriageService
      .addFeedback(marriage._id, comment)
      .then((response) => {
        setMarriage(response.data.marriage);
      })
      .catch((err) => {
        console.error("Error adding feedback:", err);
        alert("Failed to send message. Please try again.");
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          <p className="mt-2 text-lg text-gray-700">
            Loading application details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !marriage) {
    return (
      <div className="min-h-screen lg:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow lg:p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Error Loading Application
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {error || "Application not found or unable to load details."}
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/user/marriage-queries")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Queries
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare the application data for display
  const applicationData = {
    submissionDate: format(new Date(marriage.createdAt), "dd/MM/yyyy"),
    groom: {
      surname: marriage.partnerOne.lastName,
      givenNames: marriage.partnerOne.firstName,
      dateOfBirth: marriage.partnerOne.dateOfBirth
        ? format(new Date(marriage.partnerOne.dateOfBirth), "dd MMMM yyyy")
        : "",
      placeOfBirth: "",
      occupation: "",
    },
    bride: {
      surname: marriage.partnerTwo.lastName,
      givenNames: marriage.partnerTwo.firstName,
      dateOfBirth: marriage.partnerTwo.dateOfBirth
        ? format(new Date(marriage.partnerTwo.dateOfBirth), "dd MMMM yyyy")
        : "",
      placeOfBirth: "",
      occupation: "",
    },
    marriage: {
      intendedDate: marriage.preferredDate
        ? format(new Date(marriage.preferredDate), "dd MMMM yyyy")
        : marriage.marriageDate
        ? format(new Date(marriage.marriageDate), "dd MMMM yyyy")
        : "",
      intendedPlace: marriage.preferredLocation || marriage.marriagePlace || "",
      witnesses: marriage.witnesses
        ? marriage.witnesses.map(
            (w) => `${w.name} ${w.contact ? "- " + w.contact : ""}`
          )
        : [],
    },
  };

  const needsMeeting =
    marriage.type === "reservation" &&
    ["assigned", "in-progress"].includes(marriage.status) &&
    (!marriage.meetings || marriage.meetings.length === 0);

  // Update the showCertificate condition
  const showCertificate =
    marriage.status === "completed" &&
    marriage.type === "certificate" &&
    (marriage.certificateFile || marriage.certificate_generated);

  // And update where it's used
  {
    showCertificate && <DownloadCertificate marriage={marriage} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/user/marriage-queries")}
            className="mr-4 p-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {marriage.type === "reservation"
                ? "Marriage Reservation"
                : "Marriage Certificate"}{" "}
              Application
            </h1>
            <p className="text-sm text-gray-500">
              Application ID: {ConvertIDtoSmallID(marriage._id)}
            </p>
          </div>
        </div>

        {/* Main application display */}
        {needsMeeting && (
          <>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Application for Marriage Reservation
              </h2>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                View Full Form
              </button>
            </div>
            <ScheduleMeetingBanner
              marriage={marriage}
              onScheduleMeeting={() => setIsScheduleModalOpen(true)}
            />
          </>
        )}

        <div className="text-sm text-gray-600 mb-8">
          <span className="font-medium">Submission Date:</span>{" "}
          {applicationData.submissionDate}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:flex-1">
            <div className="bg-white rounded-lg shadow p-8 space-y-8">
              <h3 className="text-xl font-semibold text-gray-900">
                {marriage.type === "reservation"
                  ? "Notice of Intended Marriage"
                  : "Marriage Certificate Request"}
              </h3>

              <div>
                <SectionTitle>Partner 1 Details</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldGroup
                    label="Surname"
                    value={applicationData.groom.surname}
                  />
                  <FieldGroup
                    label="Given Names"
                    value={applicationData.groom.givenNames}
                  />
                  {marriage.type === "certificate" && (
                    <FieldGroup
                      label="Date of Birth"
                      value={applicationData.groom.dateOfBirth}
                    />
                  )}
                  {marriage.type === "reservation" && (
                    <>
                      <FieldGroup
                        label="Phone"
                        value={marriage.partnerOne.phone || ""}
                      />
                      <FieldGroup
                        label="Email"
                        value={marriage.partnerOne.email || ""}
                      />
                      <div className="col-span-2">
                        <FieldGroup
                          label="Address"
                          value={marriage.partnerOne.address || ""}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <SectionTitle>Partner 2 Details</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldGroup
                    label="Surname"
                    value={applicationData.bride.surname}
                  />
                  <FieldGroup
                    label="Given Names"
                    value={applicationData.bride.givenNames}
                  />
                  {marriage.type === "certificate" && (
                    <FieldGroup
                      label="Date of Birth"
                      value={applicationData.bride.dateOfBirth}
                    />
                  )}
                  {marriage.type === "reservation" && (
                    <>
                      <FieldGroup
                        label="Phone"
                        value={marriage.partnerTwo.phone || ""}
                      />
                      <FieldGroup
                        label="Email"
                        value={marriage.partnerTwo.email || ""}
                      />
                      <div className="col-span-2">
                        <FieldGroup
                          label="Address"
                          value={marriage.partnerTwo.address || ""}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <SectionTitle>
                  {marriage.type === "reservation"
                    ? "Reservation Details"
                    : "Marriage Details"}
                </SectionTitle>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldGroup
                      label={
                        marriage.type === "reservation"
                          ? "Preferred Date"
                          : "Marriage Date"
                      }
                      value={applicationData.marriage.intendedDate}
                    />
                    <FieldGroup
                      label={
                        marriage.type === "reservation"
                          ? "Preferred Location"
                          : "Marriage Place"
                      }
                      value={applicationData.marriage.intendedPlace}
                    />
                    {marriage.type === "reservation" &&
                      marriage.preferredTime && (
                        <FieldGroup
                          label="Preferred Time"
                          value={marriage.preferredTime}
                        />
                      )}
                  </div>

                  {marriage.type === "certificate" &&
                    marriage.witnesses &&
                    marriage.witnesses.length > 0 && (
                      <div>
                        <label className="block text-sm text-green-700">
                          Witnesses
                        </label>
                        <div className="space-y-2 mt-1">
                          {applicationData.marriage.witnesses.map(
                            (witness, index) => (
                              <input
                                key={index}
                                type="text"
                                value={witness}
                                readOnly
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700"
                              />
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {marriage.additionalInformation && (
                    <div>
                      <label className="block text-sm text-green-700">
                        Additional Information
                      </label>
                      <textarea
                        value={marriage.additionalInformation}
                        readOnly
                        rows={3}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700 mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Meeting List - Only for reservation type */}
              {marriage.type === "reservation" &&
                marriage.meetings &&
                marriage.meetings.length > 0 && (
                  <MeetingList meetings={marriage.meetings} />
                )}

              {/* Feedback Section */}
              <FeedbackSection
                feedbacks={marriage.feedback}
                onAddFeedback={handleAddFeedback}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          {(marriage.status === "completed" ||
            marriage.feedback?.length > 0 ||
            marriage.meetings?.length > 0) && (
            <div className="lg:w-96">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-medium mb-4">Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">
                      Submitted on:{" "}
                    </span>
                    <span className="text-sm font-medium">
                      {format(new Date(marriage.createdAt), "dd/MM/yyyy")}
                    </span>
                  </div>
                  {marriage.status === "completed" && (
                    <div>
                      <span className="text-sm text-gray-500">
                        Completed on:{" "}
                      </span>
                      <span className="text-sm font-medium">
                        {format(new Date(marriage.updatedAt), "dd/MM/yyyy")}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500">Status: </span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        marriage.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : marriage.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : marriage.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : marriage.status === "assigned"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {marriage.status.charAt(0).toUpperCase() +
                        marriage.status.slice(1)}
                    </span>
                  </div>
                  {marriage.assignedShaykh && (
                    <div>
                      <span className="text-sm text-gray-500">
                        Assigned Shaykh:{" "}
                      </span>
                      <span className="text-sm font-medium">
                        {marriage.assignedShaykh.firstName}{" "}
                        {marriage.assignedShaykh.lastName}
                      </span>
                    </div>
                  )}
                  {/* {marriage?.certificateNumber && (
                    <div>
                      <span className="text-sm text-gray-500">
                        Certificate Number:{" "}
                      </span>
                      <span className="text-sm font-medium">
                        {marriage.certificateNumber}
                      </span>
                    </div>
                  )} */}
                </div>

                {showCertificate && (
                  <DownloadCertificate marriage={marriage} className="mt-6" />
                )}

                <Timeline marriage={marriage} />
              </div>
            </div>
          )}
        </div>
      </div>

      {isScheduleModalOpen && (
        <ScheduleMeetingModal
          onClose={() => setIsScheduleModalOpen(false)}
          onSchedule={handleScheduleMeeting}
          marriage={marriage}
        />
      )}
    </div>
  );
};

export default MarriageApplicationView;
