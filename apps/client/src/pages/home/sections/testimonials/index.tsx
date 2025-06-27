/* eslint-disable lingui/text-restrictions */
/* eslint-disable lingui/no-unlocalized-strings */

import { t } from "@lingui/macro";
import { motion } from "framer-motion";

type Testimonial = {
  name: string;
  username: string;
  avatar: string;
  content: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Alex Chen",
    username: "@alexchen",
    avatar: "https://avatar.vercel.sh/alex",
    content: t`This platform really made creating my resume easy and smooth! The templates are professional and the interface is intuitive.`,
  },
  {
    name: "Sarah Johnson",
    username: "@sarahj",
    avatar: "https://avatar.vercel.sh/sarah",
    content: t`I love this resume builder. Thank you so much for making such an amazing tool for job seekers.`,
  },
  {
    name: "Mike Davis",
    username: "@mikedavis",
    avatar: "https://avatar.vercel.sh/mike",
    content: t`The templates are beautiful and professional. This platform helped me land my dream job!`,
  },
];

export const TestimonialsSection = () => (
  <section id="testimonials" className="relative py-24 sm:py-32">
    <div className="container space-y-12">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold">{t`Loved by professionals worldwide`}</h1>
        <p className="mx-auto max-w-2xl leading-relaxed opacity-60">
          {t`Join thousands of users who have successfully created professional resumes with our platform.`}
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            viewport={{ once: true }}
            initial={{ opacity: 0, y: 50 }}
            className="bg-card space-y-4 rounded-lg border p-6"
            whileInView={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
          >
            <p className="text-sm leading-relaxed">{testimonial.content}</p>

            <div className="flex items-center gap-x-3">
              <img
                width={40}
                height={40}
                alt={testimonial.name}
                src={testimonial.avatar}
                className="bg-muted rounded-full"
              />

              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-xs opacity-60">{testimonial.username}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
