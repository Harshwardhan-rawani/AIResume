import { Card, CardContent } from '@/components/ui/card'
import { Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

const isNotEmpty = (val) => val && val.trim() !== ''
const isValidArray = (arr) => Array.isArray(arr) && arr.some(obj => Object.values(obj).some(isNotEmpty))

const formatDescription = (text) => (
  <p className="text-sm text-gray-700 mt-1">
    {isNotEmpty(text) ? text : null}
  </p>
)

const template1 = ({ data }) => {
  const resumeData = data
  if (!resumeData || Object.keys(resumeData).length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">No Resume Data Available</h2>
        <p className="text-gray-600">Please create or select a resume to view.</p>
      </div>
    )
  }

  return (
    <Card className="mx-auto bg-white  shadow-lg">
      <CardContent className="p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {resumeData.personalInfo?.fullName}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm text-gray-600">
            {isNotEmpty(resumeData.personalInfo.email) && (
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />{resumeData.personalInfo?.email}
              </div>
            )}
            {isNotEmpty(resumeData.personalInfo.phone) && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />{resumeData.personalInfo?.phone}
              </div>
            )}
            {isNotEmpty(resumeData.personalInfo.location) && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />{resumeData.personalInfo?.location}
              </div>
            )}
            {isNotEmpty(resumeData.personalInfo.linkedin) && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-4 w-4" />{resumeData.personalInfo?.linkedin}
              </div>
            )}
            {isNotEmpty(resumeData.personalInfo.website) && (
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />{resumeData.personalInfo?.website}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {isNotEmpty(resumeData.summary?.content) && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 border-b pb-1">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.summary.content}</p>
          </section>
        )}

        {/* Experience */}
        {isValidArray(resumeData.experience) && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-1">Professional Experience</h2>
            {resumeData.experience.map((exp, index) =>
              isNotEmpty(exp.jobTitle) || isNotEmpty(exp.company) || isNotEmpty(exp.description) ? (
                <div key={index} className="mb-6">
                  <div className="flex justify-between flex-col md:flex-row">
                    <div>
                      <h3 className="font-medium">{exp.jobTitle || "Job Title"}</h3>
                      <p className="text-gray-700">
                        {exp.company}{exp.company && exp.location ? " • " : ""}{exp.location}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {(exp.startMonth || "") + " " + (exp.startYear || "")}
                      {(exp.startMonth || exp.startYear) && (exp.endMonth || exp.endYear) ? " - " : ""}
                      {(exp.endMonth || "") + " " + (exp.endYear || "")}
                    </p>
                  </div>
                  {formatDescription(exp.description)}
                </div>
              ) : null
            )}
          </section>
        )}

        {/* Education */}
        {isValidArray(resumeData.education) && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-1">Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="flex justify-between flex-col md:flex-row mb-4">
                <div>
                  <h3 className="font-medium">{edu.degree || "Degree"}</h3>
                  <p className="text-gray-700">
                    {edu.institution}{edu.institution && edu.location ? " • " : ""}{edu.location}
                  </p>
                  {isNotEmpty(edu.cgpa) && <p className="text-sm text-gray-600">CGPA: {edu.cgpa}</p>}
                </div>
                <p className="text-sm text-gray-600">
                  {(edu.startYear || "") + (edu.startYear && edu.endYear ? " - " : "") + (edu.endYear || "")}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {isValidArray(resumeData.projects) && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-1">Projects</h2>
            {resumeData.projects.map((project, index) =>
              isNotEmpty(project.title) || isNotEmpty(project.description) ? (
                <div key={index} className="mb-6">
                  <h3 className="font-medium">{project.title || "Project Title"}</h3>
                  {isNotEmpty(project.technologies) && <p className="text-sm text-gray-600">Technologies: {project.technologies}</p>}
                  {isNotEmpty(project.link) && <p className="text-sm text-blue-600">{project.link}</p>}
                  {formatDescription(project.description)}
                </div>
              ) : null
            )}
          </section>
        )}

        {/* Skills */}
        {(isNotEmpty(resumeData.skills?.technical) || isNotEmpty(resumeData.skills?.soft)) && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-1">Skills</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {isNotEmpty(resumeData.skills.technical) && (
                <div>
                  <h3 className="font-medium">Technical Skills</h3>
                  <p className="text-sm text-gray-700">{resumeData.skills.technical}</p>
                </div>
              )}
              {isNotEmpty(resumeData.skills.soft) && (
                <div>
                  <h3 className="font-medium">Soft Skills</h3>
                  <p className="text-sm text-gray-700">{resumeData.skills.soft}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Certifications, Languages, Activities, Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isValidArray(resumeData.certifications) && (
            <div>
              <h2 className="text-lg font-semibold mb-3 border-b pb-1">Certifications</h2>
              {resumeData.certifications.map((cert, index) =>
                isNotEmpty(cert.name) ? (
                  <div key={index} className="mb-3">
                    <h3 className="text-base font-medium">{cert.name}</h3>
                    {isNotEmpty(cert.organization) && <p className="text-sm">{cert.organization}</p>}
                    {isNotEmpty(cert.issueDate) && <p className="text-sm text-gray-600">{cert.issueDate}</p>}
                  </div>
                ) : null
              )}
            </div>
          )}

          {isValidArray(resumeData.languages) && (
            <div>
              <h2 className="text-lg font-semibold mb-3 border-b pb-1">Languages</h2>
              {resumeData.languages.map((lang, index) =>
                isNotEmpty(lang.name) ? (
                  <div key={index} className="flex justify-between mb-1">
                    <span>{lang.name}</span>
                    <span className="text-sm text-gray-600">{lang.proficiency}</span>
                  </div>
                ) : null
              )}
            </div>
          )}

          {isValidArray(resumeData.activities) && (
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-3 border-b pb-1">Activities & Achievements</h2>
              {resumeData.activities.map((activity, index) =>
                isNotEmpty(activity.title) || isNotEmpty(activity.description) ? (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between">
                      <h3 className="text-base font-medium">{activity.title}</h3>
                      <span className="text-sm text-gray-600">{activity.date}</span>
                    </div>
                    <p className="text-sm text-gray-700">{activity.description}</p>
                  </div>
                ) : null
              )}
            </div>
          )}

          {isNotEmpty(resumeData.interests) && (
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-3 border-b pb-1">Interests</h2>
              <p className="text-sm text-gray-700">{resumeData.interests}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default template1
