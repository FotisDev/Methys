"use client";

import { submitSupportTicket } from "@/_lib/backend/SupportSubmitForm/action";
import { useActionState } from "react";


type Category = {
  id: string;
  name: string;
  slug: string;
};

const initialState = {
  status: "idle" as const,
  message: "",
};

export default function SupportForm({ categories }: { categories: Category[] }) {
  const [state, formAction, isPending] = useActionState(submitSupportTicket, initialState);

  if (state.status === "success") {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-lg font-semibold text-gray-800">Ticket submitted!</h2>
        <p className="text-gray-500 text-sm mt-1">We'll reach out to you via email shortly.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          name="name"
          type="text"
          required
          placeholder="John Doe"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          name="category_id"
          defaultValue={categories[0]?.id}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Describe your issue in detail..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {state.status === "error" && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {isPending ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
}
