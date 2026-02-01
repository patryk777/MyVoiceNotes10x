import { NOTE_COLORS, CATEGORIES, TRANSLATION_LANGUAGES, MAX_IMAGE_SIZE } from "@/lib/constants";

describe("lib/constants", () => {
  describe("NOTE_COLORS", () => {
    it("has 8 color options", () => {
      expect(NOTE_COLORS.length).toBe(8);
    });

    it("includes default color", () => {
      const defaultColor = NOTE_COLORS.find((c) => c.id === "default");
      expect(defaultColor).toBeDefined();
    });

    it("each color has id, bg, and border properties", () => {
      NOTE_COLORS.forEach((color) => {
        expect(color).toHaveProperty("id");
        expect(color).toHaveProperty("bg");
        expect(color).toHaveProperty("border");
      });
    });

    it("bg classes start with bg-", () => {
      NOTE_COLORS.forEach((color) => {
        expect(color.bg).toMatch(/^bg-/);
      });
    });

    it("border classes start with border-", () => {
      NOTE_COLORS.forEach((color) => {
        expect(color.border).toMatch(/^border-/);
      });
    });
  });

  describe("CATEGORIES", () => {
    it("has 4 categories", () => {
      expect(CATEGORIES.length).toBe(4);
    });

    it("includes all required categories", () => {
      const ids = CATEGORIES.map((c) => c.id);
      expect(ids).toContain("tasks");
      expect(ids).toContain("ideas");
      expect(ids).toContain("notes");
      expect(ids).toContain("meetings");
    });

    it("each category has Polish and English labels", () => {
      CATEGORIES.forEach((cat) => {
        expect(cat).toHaveProperty("labelPl");
        expect(cat).toHaveProperty("labelEn");
        expect(cat.labelPl.length).toBeGreaterThan(0);
        expect(cat.labelEn.length).toBeGreaterThan(0);
      });
    });
  });

  describe("TRANSLATION_LANGUAGES", () => {
    it("has 5 language options", () => {
      expect(TRANSLATION_LANGUAGES.length).toBe(5);
    });

    it("includes Polish", () => {
      const polish = TRANSLATION_LANGUAGES.find((l) => l.id === "polski");
      expect(polish).toBeDefined();
    });

    it("includes English", () => {
      const english = TRANSLATION_LANGUAGES.find((l) => l.id === "angielski");
      expect(english).toBeDefined();
    });

    it("each language has id, label, and labelEn", () => {
      TRANSLATION_LANGUAGES.forEach((lang) => {
        expect(lang).toHaveProperty("id");
        expect(lang).toHaveProperty("label");
        expect(lang).toHaveProperty("labelEn");
      });
    });
  });

  describe("MAX_IMAGE_SIZE", () => {
    it("is 500KB", () => {
      expect(MAX_IMAGE_SIZE).toBe(500000);
    });

    it("is a positive number", () => {
      expect(MAX_IMAGE_SIZE).toBeGreaterThan(0);
    });
  });
});
