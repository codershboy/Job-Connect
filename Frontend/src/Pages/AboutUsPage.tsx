import React from "react";
import Header from "../Header/Header";
import { Container, Card, Text, Avatar, SimpleGrid, Title, Badge, Stack } from "@mantine/core";
import { IconBrandReact, IconBrandTailwind, IconCode, IconDatabase } from "@tabler/icons-react";

const AboutUsPage = () => {
  const team = [
    {
      name: "Shantanu Yadav",
      role: "Lead Full-Stack Architect",
      bio: "Spearheading UI experiences and secure backend integrations.",
      initials: "SY",
    },
    {
      name: "Tanya Rana",
      role: "DevOps Engineer",
      bio: "Managing database migrations, environments, and automated pipelines.",
      initials: "TR",
    },
    {
      name: "Yash Singh Kathayat",
      role: "Product Owner",
      bio: "Crafting application requirements and workflow lifecycles.",
      initials: "YSK",
    },
  ];

  return (
    <div className="min-h-[100vh] bg-mine-shaft-950 text-white pb-16">
      <Header />

      <Container size="lg" className="mt-16">
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge color="bright-sun" variant="light" size="lg" className="text-bright-sun-400 bg-bright-sun-500/10 mb-4">
            Our Mission
          </Badge>
          <Title order={1} className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Connecting Talent with Tomorrow
          </Title>
          <Text size="lg" className="text-mine-shaft-300">
            JobConnect is a premium, open-source portal connecting skilled technology developers directly with employers, built on safety, speed, and modern engineering.
          </Text>
        </div>

        {/* Tech Stack details */}
        <div className="mb-20">
          <Title order={2} className="text-2xl font-bold mb-8 text-center text-bright-sun-400">
            Powered By Modern Engineering
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder className="bg-[#1e1e1e] border-white/5 text-center">
              <IconBrandReact size={40} className="text-blue-400 mx-auto mb-3" />
              <Text fw={700} className="text-white">React 19 & TS</Text>
              <Text size="xs" className="text-mine-shaft-400 mt-2">
                Type-safe frontend code, leveraging hooks and state providers.
              </Text>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder className="bg-[#1e1e1e] border-white/5 text-center">
              <IconCode size={40} className="text-green-400 mx-auto mb-3" />
              <Text fw={700} className="text-white">Spring Boot 3.5</Text>
              <Text size="xs" className="text-mine-shaft-400 mt-2">
                Enterprise REST API structure with JWT authorization filters.
              </Text>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder className="bg-[#1e1e1e] border-white/5 text-center">
              <IconBrandTailwind size={40} className="text-teal-400 mx-auto mb-3" />
              <Text fw={700} className="text-white">Tailwind & Mantine</Text>
              <Text size="xs" className="text-mine-shaft-400 mt-2">
                Ultra-responsive premium CSS layouts combined with robust mantine fields.
              </Text>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder className="bg-[#1e1e1e] border-white/5 text-center">
              <IconDatabase size={40} className="text-purple-400 mx-auto mb-3" />
              <Text fw={700} className="text-white">MySQL & JPA</Text>
              <Text size="xs" className="text-mine-shaft-400 mt-2">
                Relational schema indexing with lazy-loaded entities and transaction safety.
              </Text>
            </Card>
          </SimpleGrid>
        </div>

        {/* Team Section */}
        <div>
          <Title order={2} className="text-2xl font-bold mb-8 text-center text-bright-sun-400">
            Meet the Builders
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            {team.map((member, idx) => (
              <Card
                key={idx}
                shadow="md"
                padding="xl"
                radius="md"
                withBorder
                className="bg-[#1e1e1e] border-white/5 hover:border-bright-sun-400/20 transition-colors duration-300"
              >
                <Stack align="center" gap="sm" className="text-center">
                  <Avatar size="xl" radius="xl" color="bright-sun">
                    {member.initials}
                  </Avatar>
                  <div>
                    <Text fw={700} size="lg" className="text-white">{member.name}</Text>
                    <Text size="xs" className="text-bright-sun-400 font-semibold uppercase tracking-wider">{member.role}</Text>
                  </div>
                  <Text size="sm" className="text-mine-shaft-300 mt-2">
                    {member.bio}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </div>
      </Container>
    </div>
  );
};

export default AboutUsPage;
