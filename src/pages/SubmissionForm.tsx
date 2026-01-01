import "../index.css"
import { submissionSchema } from "../interfaces/submissionSchema"
import type { SubmissionFormData } from "../interfaces/submissionSchema"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const SubmissionForm = () => {
   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema) as Resolver<SubmissionFormData>,
  })

  const onSubmit = (data: SubmissionFormData) => {
    console.log(data)
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="min-h-full px-4 py-6 flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-3xl rounded-2xl p-6 sm:p-8 space-y-10"
          style={{
            background: "var(--fore-bg)",
            boxShadow: "0 8px 24px var(--shadow-color)",
          }}
        >
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Create Submission
            </h1>
            <p className="text-sm text-[var(--text-light)]">
              Share your internship / placement experience
            </p>
          </div>

          <Section title="Company & Role">
            <TwoCol>
              <Field error={errors.company?.message}>
                <label className="field-label">Company</label>
                <select className="input" {...register("company")}>
                  <option value="">Select company</option>
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon">Amazon</option>
                </select>
              </Field>

              <Field error={errors.role?.message}>
                <label className="field-label">Role</label>
                <select className="input" {...register("role")}>
                  <option value="">Select role</option>
                  <option value="Software Engineer Intern">
                    Software Engineer Intern
                  </option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                </select>
              </Field>
            </TwoCol>
          </Section>

          <Section title="Submission Type">
            <Field error={errors.type?.message}>
              <select className="input" {...register("type")}>
                <option value="">Select type</option>
                <option value="INTERN">INTERN</option>
                <option value="PLACED">PLACED</option>
                <option value="INTERN_TO_PPO">INTERN TO PPO</option>
              </select>
            </Field>
          </Section>

          <Section title="Experience">
            <Field error={errors.experience?.message}>
              <textarea
                className="textarea min-h-[160px]"
                {...register("experience")}
                placeholder="Write your detailed experience"
              />
            </Field>
          </Section>

          <Section title="Insights">
            <textarea className="textarea" {...register("benefits")} placeholder="Benefits" />
            <textarea className="textarea" {...register("mistakes")} placeholder="Mistakes" />
            <textarea className="textarea" {...register("resources")} placeholder="Resources" />
          </Section>

          <Section title="Academic">
            <TwoCol>
              <Field error={errors.cgpa?.message}>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  {...register("cgpa")}
                  placeholder="CGPA"
                />
              </Field>

              <input
                className="input"
                {...register("clubPositions")}
                placeholder="Club Positions"
              />
            </TwoCol>
          </Section>

          <Section title="Compensation">
            <ThreeCol>
              <input
                type="number"
                className="input"
                {...register("ctc")}
                placeholder="CTC"
              />
              <Field error={errors.basePay?.message}>
                <input
                  type="number"
                  className="input"
                  {...register("basePay")}
                  placeholder="Base Pay"
                />
              </Field>
              <input
                type="number"
                className="input"
                {...register("stipend")}
                placeholder="Stipend"
              />
            </ThreeCol>
          </Section>

          <Section title="Interview Process">
            <TwoCol>
              <input
                type="number"
                className="input"
                {...register("otRounds")}
                placeholder="OT Rounds"
              />
              <input
                type="number"
                className="input"
                {...register("piRounds")}
                placeholder="PI Rounds"
              />
            </TwoCol>
          </Section>

          <Section title="Duration">
            <TwoCol>
              <input type="date" className="input" {...register("startDate")} />
              <input type="date" className="input" {...register("endDate")} />
            </TwoCol>
          </Section>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-medium transition"
            style={{ background: "var(--accent)", color: "#000" }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

/* ---------- UI helpers ---------- */

function Field({
  children,
  error,
}: {
  children: React.ReactNode
  error?: string
}) {
  return (
    <div className="space-y-1">
      {children}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium">{title}</h2>
      {children}
    </section>
  )
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  )
}

function ThreeCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {children}
    </div>
  )
}

export default SubmissionForm
