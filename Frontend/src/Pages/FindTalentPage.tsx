import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { Loader, TextInput, Select, Button, Group, Text, Card, Badge, Stack, Container, Avatar } from "@mantine/core";
import { IconSearch, IconLock, IconAlertCircle, IconMail, IconFileText, IconTarget } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface Candidate {
  id: number;
  name: string;
  email: string;
  role: string;
  title: string | null;
  skills: string | null;
}

const calculateMatchScore = (jobSkillsStr: string | null | undefined, userSkillsStr: string | null | undefined) => {
  if (!jobSkillsStr) return { score: 100, matched: [], missing: [] };
  
  const jobSkills = jobSkillsStr.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  if (jobSkills.length === 0) return { score: 100, matched: [], missing: [] };
  
  if (!userSkillsStr) {
    const jobSkillsOriginal = jobSkillsStr.split(",").map(s => s.trim()).filter(Boolean);
    return { score: 0, matched: [], missing: jobSkillsOriginal };
  }
  
  const userSkills = userSkillsStr.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const jobSkillsOriginal = jobSkillsStr.split(",").map(s => s.trim()).filter(Boolean);
  
  const matched: string[] = [];
  const missing: string[] = [];
  
  jobSkillsOriginal.forEach((skill) => {
    if (userSkills.includes(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });
  
  const score = Math.round((matched.length / jobSkillsOriginal.length) * 100);
  return { score, matched, missing };
};

const FindTalentPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [employerJobs, setEmployerJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get("/users/applicants");
      setCandidates(response.data);
    } catch (err: any) {
      setError("Failed to fetch candidate profiles. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployerJobs = async () => {
    try {
      const response = await apiClient.get("/jobs", {
        params: {
          size: 1000
        }
      });
      const allJobs = response.data.content || [];
      const myJobs = allJobs.filter((j: any) => j.employer?.email === auth.user?.email);
      setEmployerJobs(myJobs);
    } catch (err) {
      console.error("Failed to fetch employer jobs:", err);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.role === "EMPLOYER") {
      fetchCandidates();
      fetchEmployerJobs();
    }
  }, [auth.isAuthenticated, auth.user]);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleContact = (candidate: Candidate) => {
    window.location.href = `mailto:${candidate.email}?subject=Job Opportunity from Acme Corp`;
  };

  const handleViewResume = (name: string) => {
    alert(`Opening resume link for ${name}. (Mock download started successfully)`);
  };

  // Guard: If not signed in or not an Employer
  const isAuthorized = auth.isAuthenticated && auth.user?.role === "EMPLOYER";

  // Filter candidates based on name, title, or skills
  const selectedJob = employerJobs.find(j => String(j.id) === selectedJobId);

  const processedCandidates = candidates.map(c => {
    let matchScore = 0;
    let matchedSkills: string[] = [];
    let missingSkills: string[] = [];
    
    if (selectedJob) {
      const match = calculateMatchScore(selectedJob.skills, c.skills);
      matchScore = match.score;
      matchedSkills = match.matched;
      missingSkills = match.missing;
    }
    
    return {
      ...c,
      matchScore,
      matchedSkills,
      missingSkills
    };
  });

  const filteredCandidates = processedCandidates.filter((c) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = c.name.toLowerCase().includes(query);
    const titleMatch = c.title ? c.title.toLowerCase().includes(query) : false;
    const skillsMatch = c.skills ? c.skills.toLowerCase().includes(query) : false;
    return nameMatch || titleMatch || skillsMatch;
  });

  if (selectedJob) {
    filteredCandidates.sort((a, b) => b.matchScore - a.matchScore);
  }

  return (
    <div className="min-h-[100vh] bg-mine-shaft-950 text-white pb-16">
      <Header />

      {!auth.isAuthenticated ? (
        <Container size="sm" className="mt-16">
          <Card shadow="md" padding="xl" radius="md" withBorder className="bg-[#1e1e1e] border-white/5 text-center py-12">
            <IconLock size={64} className="text-bright-sun-400 mx-auto mb-4" />
            <Text size="xl" fw={700} className="text-white">Sign In Required</Text>
            <Text size="sm" className="text-mine-shaft-400 mt-2 max-w-sm mx-auto">
              Please sign in with an Employer account to view and search applicant profiles.
            </Text>
          </Card>
        </Container>
      ) : !isAuthorized ? (
        <Container size="sm" className="mt-16">
          <Card shadow="md" padding="xl" radius="md" withBorder className="bg-[#1e1e1e] border-white/5 text-center py-12">
            <IconAlertCircle size={64} className="text-red-400 mx-auto mb-4" />
            <Text size="xl" fw={700} className="text-white">Employer Access Only</Text>
            <Text size="sm" className="text-mine-shaft-400 mt-2 max-w-sm mx-auto">
              Your account is registered as a **Job Seeker**. Only **Employers** have permissions to search candidate profiles.
            </Text>
            <Button
              onClick={() => navigate("/find-jobs")}
              color="bright-sun"
              className="bg-bright-sun-400 hover:bg-bright-sun-500 text-mine-shaft-950 font-bold px-8 mt-6 mx-auto"
            >
              Browse Open Positions
            </Button>
          </Card>
        </Container>
      ) : (
        <div>
          {/* Search Header Section */}
          <div className="bg-mine-shaft-900 border-b border-white/5 py-10 px-16 shadow-inner">
            <div className="max-w-5xl mx-auto">
              <Text size="xl" fw={700} className="mb-4 text-bright-sun-400">
                Discover Top Engineering & Design Talent
              </Text>
              
              <div className="flex flex-col md:flex-row gap-4 bg-mine-shaft-950 p-3 rounded-xl border border-white/10 shadow-xl items-center">
                <TextInput
                  placeholder="Search by candidate name, skills (e.g. React, Docker), or titles..."
                  leftSection={<IconSearch size="1.2rem" className="text-mine-shaft-400" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 w-full md:w-auto"
                  styles={{
                    input: { backgroundColor: "transparent", color: "#fff", border: "none" }
                  }}
                />
                
                <div className="w-px bg-white/10 hidden md:block h-8"></div>
                
                <Select
                  placeholder="Rank compatibility for job posting..."
                  data={employerJobs.map(job => ({
                    value: String(job.id),
                    label: `${job.title} (${job.location})`
                  }))}
                  value={selectedJobId}
                  onChange={setSelectedJobId}
                  clearable
                  leftSection={<IconTarget size="1.2rem" className="text-indigo-400" />}
                  className="w-full md:w-[320px]"
                  styles={{
                    input: { backgroundColor: "transparent", color: "#fff", border: "none" },
                    dropdown: { backgroundColor: "#2d2d2d", border: "1px solid #454545" }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Talent Listings */}
          <div className="max-w-6xl mx-auto px-6 mt-12">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20 gap-4">
                <Loader color="bright-sun" size="xl" />
                <Text className="text-mine-shaft-300">Retrieving talent database...</Text>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center max-w-lg mx-auto">
                <Text fw={600} color="red" className="mb-2">Connectivity Error</Text>
                <Text size="sm" className="text-mine-shaft-300">{error}</Text>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="text-center py-20 bg-mine-shaft-900 rounded-2xl border border-white/5 shadow-md">
                <IconSearch size={64} className="text-mine-shaft-500 mx-auto mb-4" />
                <Text size="lg" fw={600} className="text-mine-shaft-200">No Candidates Found</Text>
                <Text size="sm" className="text-mine-shaft-400 mt-1">We couldn't find any profiles matching your search query. Try typing another skill!</Text>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map((candidate) => {
                  const skillsList = candidate.skills
                    ? candidate.skills.split(",").map((s) => s.trim())
                    : ["Software Development"];

                  return (
                    <Card
                      key={candidate.id}
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      styles={{
                        root: {
                          backgroundColor: "#ffffff",
                          borderColor: "#e2e8f0",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: "280px"
                        }
                      }}
                      className="hover:border-indigo-400/40 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-2xl"
                    >
                      <Stack gap="sm">
                        <Group align="center" gap="md">
                          <Avatar size="lg" radius="xl" color="indigo" variant="light">
                            {getInitials(candidate.name)}
                          </Avatar>
                          <div className="max-w-[70%]">
                            <Text fw={700} size="lg" c="#0f172a" className="truncate">
                              {candidate.name}
                            </Text>
                            <Text size="sm" c="indigo.6" className="font-semibold truncate">
                              {candidate.title || "Software Specialist"}
                            </Text>
                          </div>
                        </Group>

                        {/* Skills List */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {skillsList.map((skill, index) => (
                            <Badge key={index} color="indigo" variant="light" size="sm">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        {/* Dynamic Compatibility Details for Employers */}
                        {selectedJobId && (
                          <div className="mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800 text-[11px]">
                            <div className="font-semibold text-slate-700 flex justify-between mb-1.5">
                              <span className="flex items-center gap-1">
                                <IconTarget size={13} className="text-indigo-600" />
                                Compatibility Match:
                              </span>
                              <span className="font-bold text-indigo-600">{candidate.matchScore}%</span>
                            </div>
                            
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  candidate.matchScore >= 70 ? "bg-teal-500" : candidate.matchScore >= 40 ? "bg-amber-500" : "bg-slate-400"
                                }`}
                                style={{ width: `${candidate.matchScore}%` }}
                              />
                            </div>
                            
                            {candidate.matchedSkills.length > 0 && (
                              <div className="mb-1.5">
                                <span className="font-medium text-slate-600 block mb-0.5">Matched Skills ({candidate.matchedSkills.length}):</span>
                                <div className="flex flex-wrap gap-1">
                                  {candidate.matchedSkills.map((s, idx) => (
                                    <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1 py-0.2 rounded text-[9px] font-semibold">
                                      ✓ {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {candidate.missingSkills.length > 0 && (
                              <div>
                                <span className="font-medium text-slate-600 block mb-0.5">Missing Skills ({candidate.missingSkills.length}):</span>
                                <div className="flex flex-wrap gap-1">
                                  {candidate.missingSkills.map((s, idx) => (
                                    <span key={idx} className="bg-rose-50 text-rose-700 border border-rose-100 px-1 py-0.2 rounded text-[9px] font-semibold">
                                      ✗ {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Stack>

                      <Stack className="mt-6 pt-4 border-t border-slate-100" gap="xs">
                        <Group gap="xs" className="grid grid-cols-2">
                          <Button
                            onClick={() => handleContact(candidate)}
                            variant="light"
                            color="indigo"
                            leftSection={<IconMail size="1.0rem" />}
                            className="font-bold text-xs"
                          >
                            Email
                          </Button>
                          <Button
                            onClick={() => handleViewResume(candidate.name)}
                            variant="outline"
                            color="indigo"
                            leftSection={<IconFileText size="1.0rem" />}
                            className="font-bold text-xs"
                          >
                            Resume
                          </Button>
                        </Group>
                      </Stack>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindTalentPage;
