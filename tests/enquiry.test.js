import test from "node:test";
import assert from "node:assert/strict";
import { buildEmailDraft, validateEnquiry } from "../src/lib/enquiry.js";

const valid = {
  name: "Demo Reviewer",
  email: "reviewer@example.com",
  school: "Sample School",
  message: "Please explain available tools and onboarding.",
};
test("blank and malformed enquiries receive actionable errors", () => {
  assert.deepEqual(
    Object.keys(
      validateEnquiry({
        name: " ",
        email: "bad",
        school: "",
        message: "short",
      }),
    ),
    ["name", "email", "school", "message"],
  );
});
test("valid enquiry passes without transmitting data", () => {
  assert.deepEqual(validateEnquiry(valid), {});
});
test("field size limits protect the email draft", () => {
  assert.equal(
    Object.keys(
      validateEnquiry({
        ...valid,
        name: "a".repeat(101),
        email: "a".repeat(255) + "@example.com",
        school: "a".repeat(151),
        message: "a".repeat(1201),
      }),
    ).length,
    4,
  );
});
test("email draft safely encodes reserved characters and line breaks", () => {
  const url = new URL(
    buildEmailDraft(
      {
        ...valid,
        school: "A & B? # school",
        message: "Needs: 1 + 2\nParent & teacher records",
      },
      "info@educonnect.com.ng",
    ),
  );
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "info@educonnect.com.ng");
  assert.equal(
    url.searchParams.get("subject"),
    "School enquiry: A & B? # school",
  );
  assert.match(
    url.searchParams.get("body"),
    /Needs: 1 \+ 2\nParent & teacher records$/,
  );
  assert.equal([...url.searchParams.keys()].length, 2);
});
