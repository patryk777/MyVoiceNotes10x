import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NoteEditForm } from "@/components/NoteEditForm";

const mockT = (key: string) => key;

// Mock FileReader
class MockFileReader {
  result: string | null = null;
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
  
  readAsDataURL() {
    setTimeout(() => {
      this.result = "data:image/png;base64,mockImageData";
      if (this.onload) {
        this.onload({ target: { result: this.result } } as ProgressEvent<FileReader>);
      }
    }, 0);
  }
}

global.FileReader = MockFileReader as unknown as typeof FileReader;

const defaultProps = {
  initialTitle: "Test Title",
  initialContent: "Test Content",
  initialTags: ["tag1", "tag2"],
  initialColor: "default" as const,
  initialReminder: undefined,
  initialImages: [],
  noteId: "test-id",
  onSave: jest.fn(),
  onCancel: jest.fn(),
  t: mockT,
};

describe("NoteEditForm - Tags", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display existing tags as chips", () => {
    render(<NoteEditForm {...defaultProps} />);
    
    expect(screen.getByText("#tag1")).toBeInTheDocument();
    expect(screen.getByText("#tag2")).toBeInTheDocument();
  });

  it("should display tags in input field", () => {
    render(<NoteEditForm {...defaultProps} />);
    
    const input = screen.getByPlaceholderText("tags");
    expect(input).toHaveValue("tag1, tag2");
  });

  it("should remove tag when clicking X button", () => {
    render(<NoteEditForm {...defaultProps} />);
    
    // Find all remove buttons (X icons on tags)
    const removeButtons = screen.getAllByTitle("Usuń tag");
    expect(removeButtons).toHaveLength(2);
    
    // Click first remove button
    fireEvent.click(removeButtons[0]);
    
    // tag1 should be removed
    expect(screen.queryByText("#tag1")).not.toBeInTheDocument();
    expect(screen.getByText("#tag2")).toBeInTheDocument();
  });

  it("should update input when tag is removed", () => {
    render(<NoteEditForm {...defaultProps} />);
    
    const removeButtons = screen.getAllByTitle("Usuń tag");
    fireEvent.click(removeButtons[0]);
    
    const input = screen.getByPlaceholderText("tags");
    expect(input).toHaveValue("tag2");
  });

  it("should allow adding new tags via input", () => {
    render(<NoteEditForm {...defaultProps} />);
    
    const input = screen.getByPlaceholderText("tags");
    fireEvent.change(input, { target: { value: "tag1, tag2, newtag" } });
    
    expect(screen.getByText("#newtag")).toBeInTheDocument();
  });

  it("should handle empty tags gracefully", () => {
    render(<NoteEditForm {...defaultProps} initialTags={[]} />);
    
    expect(screen.queryByText(/#/)).not.toBeInTheDocument();
  });

  it("should save tags correctly when save is clicked", () => {
    const onSave = jest.fn();
    render(<NoteEditForm {...defaultProps} onSave={onSave} />);
    
    const saveButton = screen.getByText("save");
    fireEvent.click(saveButton);
    
    expect(onSave).toHaveBeenCalledWith(
      "Test Title",
      "Test Content",
      ["tag1", "tag2"],
      "default",
      null,
      []
    );
  });

  it("should save updated tags after removal", () => {
    const onSave = jest.fn();
    render(<NoteEditForm {...defaultProps} onSave={onSave} />);
    
    // Remove first tag
    const removeButtons = screen.getAllByTitle("Usuń tag");
    fireEvent.click(removeButtons[0]);
    
    // Save
    const saveButton = screen.getByText("save");
    fireEvent.click(saveButton);
    
    expect(onSave).toHaveBeenCalledWith(
      "Test Title",
      "Test Content",
      ["tag2"],
      "default",
      null,
      []
    );
  });

  it("should handle tags with whitespace", () => {
    render(<NoteEditForm {...defaultProps} initialTags={["  spaced  ", "normal"]} />);
    
    const input = screen.getByPlaceholderText("tags");
    expect(input).toHaveValue("  spaced  , normal");
  });

  it("should filter empty tags on save", () => {
    const onSave = jest.fn();
    render(<NoteEditForm {...defaultProps} onSave={onSave} />);
    
    const input = screen.getByPlaceholderText("tags");
    fireEvent.change(input, { target: { value: "tag1, , , tag2, " } });
    
    const saveButton = screen.getByText("save");
    fireEvent.click(saveButton);
    
    expect(onSave).toHaveBeenCalledWith(
      "Test Title",
      "Test Content",
      ["tag1", "tag2"],
      "default",
      null,
      []
    );
  });
});

describe("NoteEditForm - Images", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show add image button", () => {
    render(<NoteEditForm {...defaultProps} />);
    
    expect(screen.getByText("addImage")).toBeInTheDocument();
  });

  it("should have hidden file input", () => {
    render(<NoteEditForm {...defaultProps} />);
    
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveClass("hidden");
  });

  it("should accept image files only", () => {
    render(<NoteEditForm {...defaultProps} />);
    
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute("accept", "image/*");
  });

  it("should allow multiple file selection", () => {
    render(<NoteEditForm {...defaultProps} />);
    
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute("multiple");
  });

  it("should save with images when provided", () => {
    const onSave = jest.fn();
    const { container } = render(
      <NoteEditForm 
        {...defaultProps} 
        onSave={onSave}
        initialTags={[]}
        initialImages={["data:image/png;base64,testImage"]} 
      />
    );
    
    // Check image is rendered
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "data:image/png;base64,testImage");
    
    // Save
    const saveButton = screen.getByText("save");
    fireEvent.click(saveButton);
    
    expect(onSave).toHaveBeenCalledWith(
      "Test Title",
      "Test Content",
      [],
      "default",
      null,
      ["data:image/png;base64,testImage"]
    );
  });

  it("should remove image when clicking remove button", () => {
    const onSave = jest.fn();
    const { container } = render(
      <NoteEditForm 
        {...defaultProps} 
        onSave={onSave}
        initialTags={[]}
        initialImages={["data:image/png;base64,testImage"]} 
      />
    );
    
    // Image should exist initially
    expect(container.querySelector('img')).toBeInTheDocument();
    
    // Find and click remove button (bg-red-600)
    const removeButton = container.querySelector('button.bg-red-600');
    expect(removeButton).toBeInTheDocument();
    fireEvent.click(removeButton!);
    
    // Image should be removed
    expect(container.querySelector('img')).not.toBeInTheDocument();
    
    // Save and verify empty images
    fireEvent.click(screen.getByText("save"));
    expect(onSave).toHaveBeenCalledWith(
      "Test Title",
      "Test Content",
      [],
      "default",
      null,
      []
    );
  });
});
