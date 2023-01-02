import { AVATAR_URL, imageUrl } from "../src/server/common/images";

const email = "test@exmaple.com";

describe("Image URL Generation", () => {
  it("should start with url", () => {
    expect(imageUrl("", "")).toMatch(AVATAR_URL);
  });
  it("should have a letter param", () => {
    expect(imageUrl(email, "Abc")).toMatch("text=A");
    expect(imageUrl(email, "Adam Watkins")).toMatch("text=AW");
    expect(imageUrl(email, " Ad Wa")).toMatch("text=AW");
  });
  it("space is added for short names", () => {
    expect(imageUrl(email, "adam")).toMatch("text=A%20");
  });
  it("should have email", () => {
    expect(imageUrl(email, "abc")).toMatch(AVATAR_URL + "/" + email);
  });

  it("should use SVG", () => {
    expect(imageUrl(email, "abc")).toMatch(email + ".svg");
  });
  it("should handle emojis", () => {
    expect(imageUrl(email, "😃")).toMatch("text=%F0%9F%98%83");
    expect(imageUrl(email, " 👀🎉 📷🎉")).toMatch(
      "text=%F0%9F%91%80%F0%9F%93%B7"
    );
  });
  it("should handle empty name", () => {
    expect(imageUrl(email, "")).toMatch(/^((?!text=).)*$/);
  });
  it("text should be capitalized", () => {
    expect(imageUrl(email, "s D")).toMatch("text=SD");
  });
});
