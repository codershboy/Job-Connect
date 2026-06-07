import React, { useState } from "react";
import Header from "../Header/Header";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { Container, Card, TextInput, Textarea, NumberInput, Button, Text, Alert, Stack } from "@mantine/core";
import { IconAlertCircle, IconCheck, IconLock } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const UploadJobPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.isAuthenticated || auth.user?.role !== "EMPLOYER") {
      setError("Unauthorized access. Only Employers can post jobs.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await apiClient.post("/jobs", {
        title,
        description,
        location,
        salary: Number(salary),
        skills,
      });

      setSuccess(true);
      setTitle("");
      setLocation("");
      setSalary("");
      setDescription("");
      setSkills("");

      setTimeout(() => {
        navigate("/find-jobs");
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.details || "Failed to upload job posting.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Guard: If not signed in or not an Employer
  const isAuthorized = auth.isAuthenticated && auth.user?.role === "EMPLOYER";

  return (
    <div className="min-h-[100vh] bg-mine-shaft-950 text-white pb-16">
      <Header />

      <Container size="sm" className="mt-12">
        {!auth.isAuthenticated ? (
          <Card shadow="md" padding="xl" radius="md" withBorder className="bg-[#1e1e1e] border-white/5 text-center py-12">
            <IconLock size={64} className="text-bright-sun-400 mx-auto mb-4" />
            <Text size="xl" fw={700} className="text-white">Sign In Required</Text>
            <Text size="sm" className="text-mine-shaft-400 mt-2 max-w-sm mx-auto">
              Please sign in with an Employer account to upload new job postings to JobConnect.
            </Text>
          </Card>
        ) : !isAuthorized ? (
          <Card shadow="md" padding="xl" radius="md" withBorder className="bg-[#1e1e1e] border-white/5 text-center py-12">
            <IconAlertCircle size={64} className="text-red-400 mx-auto mb-4" />
            <Text size="xl" fw={700} className="text-white">Employer Access Only</Text>
            <Text size="sm" className="text-mine-shaft-400 mt-2 max-w-sm mx-auto">
              Your account is registered as a **Job Seeker**. Only **Employers** have permissions to post new vacancies.
            </Text>
            <Button
              onClick={() => navigate("/find-jobs")}
              color="bright-sun"
              className="bg-bright-sun-400 hover:bg-bright-sun-500 text-mine-shaft-950 font-bold px-8 mt-6 mx-auto"
            >
              Browse Open Positions
            </Button>
          </Card>
        ) : (
          <Card 
            shadow="lg" 
            padding="xl" 
            radius="md" 
            withBorder 
            className="bg-[#1e1e1e] border-white/5"
          >
            <Text size="xl" fw={700} className="text-bright-sun-400 mb-6 pb-2 border-b border-white/5">
              Post a New Vacancy
            </Text>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                {error && (
                  <Alert icon={<IconAlertCircle size="1rem" />} title="Submission Error" color="red" variant="filled">
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert icon={<IconCheck size="1rem" />} title="Success" color="green" variant="filled">
                    Job posted successfully! Redirecting you to the job board...
                  </Alert>
                )}

                <TextInput
                  label="Job Title"
                  placeholder="e.g. Senior Full-Stack Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  styles={{
                    label: { color: "#b0b0b0" },
                    input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
                  }}
                />

                <TextInput
                  label="Job Location"
                  placeholder="e.g. Bangalore, India (or Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  styles={{
                    label: { color: "#b0b0b0" },
                    input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
                  }}
                />

                <NumberInput
                  label="Annual Salary (₹)"
                  placeholder="e.g. 1200000"
                  value={salary}
                  onChange={setSalary}
                  required
                  min={0}
                  styles={{
                    label: { color: "#b0b0b0" },
                    input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
                  }}
                />

                <TextInput
                  label="Required Skills (comma-separated)"
                  placeholder="e.g. React, TypeScript, Tailwind CSS, Node.js"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                  styles={{
                    label: { color: "#b0b0b0" },
                    input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
                  }}
                />

                <Textarea
                  label="Job Description"
                  placeholder="Describe details, tech stack, requirements, and responsibilities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                  styles={{
                    label: { color: "#b0b0b0" },
                    input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
                  }}
                />

                <Button
                  type="submit"
                  loading={loading}
                  color="bright-sun"
                  className="bg-bright-sun-400 hover:bg-bright-sun-500 text-mine-shaft-950 font-bold px-8 mt-4 py-2"
                  fullWidth
                >
                  Publish Job Posting
                </Button>
              </Stack>
            </form>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default UploadJobPage;
