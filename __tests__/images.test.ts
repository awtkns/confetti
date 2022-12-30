import { imageUrl } from "../src/server/common/images";

describe("Image URL Generation", () => {
  it("should start with url", () => {
    expect(imageUrl("")).toMatch("https://estimator.awtkns.com/api/og");
  });
  it("should have a letter param", () => {
    expect(imageUrl("adam")).toMatch("letter=a");
    expect(imageUrl("cat")).toMatch("letter=c");
  });
  it("should have color", () => {
    expect(imageUrl("")).toMatch(/color=[A-Fa-f0-9]{6}/);
  });
  it("should handle emojis", () => {
    expect(imageUrl("😃")).toMatch("letter=%F0%9F%98%83");
  });
});
