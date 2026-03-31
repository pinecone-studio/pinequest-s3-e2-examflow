"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClassesListDocument, useCreateClassMutation } from "@/graphql/generated";
import { CloseIcon, PlusIcon } from "../../components/icons";

type CreateClassDialogProps = {
  open: boolean;
  onClose: () => void;
};

const inputClassName =
  "w-full rounded-[14px] border border-[#DFE1E5] bg-white px-4 py-3 text-[14px] text-[#0F1216] outline-none transition placeholder:text-[#8B879A] focus:border-[#B8A8FF] focus:ring-4 focus:ring-[#EEE9FF]";

export function CreateClassDialog({ open, onClose }: CreateClassDialogProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createClass, { loading }] = useCreateClassMutation();

  if (!open) {
    return null;
  }

  const resetAndClose = () => {
    setName("");
    setDescription("");
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage("Ангийн нэрээ оруулна уу.");
      return;
    }

    try {
      const result = await createClass({
        variables: {
          name: trimmedName,
          description: description.trim() || null,
        },
        refetchQueries: [{ query: ClassesListDocument }],
        awaitRefetchQueries: true,
      });

      const createdId = result.data?.createClass.id;
      resetAndClose();

      if (createdId) {
        router.push(`/classes/${createdId}`);
      }
    } catch (error) {
      console.error("Failed to create class", error);
      setErrorMessage("Анги үүсгэх үед алдаа гарлаа.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      role="dialog"
      aria-modal="true"
      onClick={resetAndClose}
    >
      <div
        className="w-full max-w-[560px] rounded-[24px] border border-[#ECEAF8] bg-[#FAFAFA] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-semibold text-[#17151F]">
              Анги үүсгэх
            </h2>
            <p className="mt-1 text-[14px] leading-6 text-[#6B6E72]">
              Одоогийн backend урсгалаар ангийн нэр, тайлбартай анги үүсгэнэ.
            </p>
          </div>
          <button
            type="button"
            aria-label="Хаах"
            className="rounded-full p-2 text-[#6B6E72] transition hover:bg-white"
            onClick={resetAndClose}
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-[13px] font-medium text-[#3F3A52]">Ангийн нэр</span>
            <input
              type="text"
              value={name}
              placeholder="Жишээ: 11Б Анги"
              className={inputClassName}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[13px] font-medium text-[#3F3A52]">Тайлбар</span>
            <textarea
              rows={4}
              value={description}
              placeholder="Нэмэлт тайлбар бичиж болно"
              className={`${inputClassName} resize-none`}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <div className="rounded-[16px] border border-[#ECEAF8] bg-[#F4F1FF] px-4 py-3 text-[13px] text-[#5E35D5]">
            Хичээл, ангийн түвшин зэрэг талбаруудыг энэ flow одоогоор backend default утгаар хадгална.
          </div>

          {errorMessage ? (
            <p className="text-[14px] text-[#B42318]">{errorMessage}</p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#DFE1E5] bg-white px-5 text-[14px] font-semibold text-[#17151F] transition hover:bg-[#F8F6FF]"
              onClick={resetAndClose}
            >
              Цуцлах
            </button>
            <button
              type="button"
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(90deg,#6434F8_0%,#7C4DFF_100%)] px-5 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(100,52,248,0.24)] transition disabled:cursor-not-allowed disabled:opacity-70"
              onClick={handleSubmit}
            >
              <PlusIcon className="h-4 w-4" />
              {loading ? "Үүсгэж байна..." : "Анги үүсгэх"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
