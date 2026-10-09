"use client";

import { submitSupportTicket } from "@/_lib/backend/SupportSubmitForm/action";
import { useActionState } from "react";
import { useT } from "@/i18n/client";
import { translateDynamic } from "@/i18n/translate";

type Category = {
  id: string;
  name: string;
  slug: string;
};

const initialState = {
  status: "idle" as const,
  message: "",
};

export default function SupportForm({
  categories,
}: {
  categories: Category[];
}) {
  const [state, formAction, isPending] = useActionState(
    submitSupportTicket,
    initialState,
  );
  const t = useT();

  if (state.status === "success") {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-lg font-semibold text-gray-800">
          {t("support.form.submitted")}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {t("support.form.submittedText")}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5 w-full ">
      <div>
        <label
          htmlFor="support-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("support.form.name")}
        </label>
        <input
          id="support-name"
          name="name"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vintage-green/40"
        />
      </div>

      <div>
        <label
          htmlFor="support-email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("support.form.email")}
        </label>
        <input
          id="support-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vintage-green/40"
        />
      </div>

      <div>
        <label
          htmlFor="support-category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("support.form.category")}
        </label>
        <select
          id="support-category"
          name="category_id"
          required
          defaultValue={""}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vintage-green/40"
        >
          <option value="" disabled>
            {t("support.form.selectCategory")}
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {translateDynamic(t, `supportCategories.${c.slug}`, c.name)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="support-order"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("support.form.orderNumber")}{" "}
          <span className="font-normal text-gray-400">
            {t("support.form.optional")}
          </span>
        </label>
        <input
          id="support-order"
          name="order_number"
          type="text"
          maxLength={50}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vintage-green/40"
        />
      </div>

      <div>
        <label
          htmlFor="support-message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("support.form.message")}
        </label>
        <textarea
          id="support-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder={t("support.form.messagePlaceholder")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vintage-green/40 resize-none"
        />
      </div>

      {state.status === "error" && (
        <p className="text-red-500 text-sm">
          {translateDynamic(t, state.message, state.message)}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full  rounded-lg py-2.5 text-sm font-medium hover-colors disabled:opacity-50 transition"
      >
        {isPending ? t("support.form.submitting") : t("support.form.submit")}
      </button>
    </form>
  );
}
