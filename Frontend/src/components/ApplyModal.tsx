import React, { useState } from "react";
import { Modal, Button, TextInput, Textarea, Text, Alert, Group } from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";

interface ApplyModalProps {
  opened: boolean;
  onClose: () => void;
  jobId: number;
  jobTitle: string;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ opened, onClose, jobId, jobTitle }) => {
  const auth = useAuth();
  const [resumeUrl, setResumeUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.isAuthenticated) {
      setError("You must be signed in to apply.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await apiClient.post("/applications", {
        jobId,
        resumeUrl,
        message,
      });
      setSuccess(true);
      setResumeUrl("");
      setMessage("");
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.details || "Failed to submit application.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} className="text-mine-shaft-50">
          Apply for {jobTitle}
        </Text>
      }
      centered
      size="md"
      styles={{
        content: { backgroundColor: "#1e1e1e", color: "#f3f3f3" },
        header: { backgroundColor: "#1e1e1e", borderBottom: "1px solid rgba(255,255,255,0.05)" },
        close: { color: "#888", hover: { backgroundColor: "rgba(255,255,255,0.05)" } }
      }}
    >
      {!auth.isAuthenticated ? (
        <div className="flex flex-col gap-4 items-center py-4">
          <IconAlertCircle size={48} className="text-bright-sun-400" />
          <Text size="md" ta="center" className="text-mine-shaft-200">
            You must be signed in as a job seeker to apply for this job.
          </Text>
          <Text size="sm" ta="center" className="text-mine-shaft-400">
            Please close this dialog and click the "Sign In" button in the header.
          </Text>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" variant="filled">
              {error}
            </Alert>
          )}

          {success && (
            <Alert icon={<IconCheck size="1rem" />} title="Success" color="green" variant="filled">
              Your application was submitted successfully!
            </Alert>
          )}

          <TextInput
            label="Resume Link"
            placeholder="Google Drive, Dropbox, or PDF link to your resume"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            required
            styles={{
              label: { color: "#b0b0b0" },
              input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
            }}
          />

          <Textarea
            label="Cover Message / Note"
            placeholder="Why should the employer hire you? Describe your experience..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
            styles={{
              label: { color: "#b0b0b0" },
              input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
            }}
          />

          <Group justify="flex-end" className="mt-4">
            <Button variant="subtle" color="gray" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              color="bright-sun"
              className="bg-bright-sun-400 hover:bg-bright-sun-500 text-mine-shaft-950 font-bold px-6"
            >
              Submit Application
            </Button>
          </Group>
        </form>
      )}
    </Modal>
  );
};

export default ApplyModal;
