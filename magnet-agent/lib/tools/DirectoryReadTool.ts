import { promises as fs } from 'fs';

import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

// Define the Zod schema for the input
const DirectoryPathSchema = z.object({
  path: z.string().optional(),
});

type DirectoryPathType = z.infer<typeof DirectoryPathSchema>;

// Define the tool
class DirectoryReadTool extends StructuredTool<typeof DirectoryPathSchema> {
  // Implement the required properties
  name = 'DirectoryReadTool';

  description = 'A tool that reads a directory';

  schema = DirectoryPathSchema;

  // Implement the protected abstract method
  protected async _call(arg: DirectoryPathType): Promise<string> {
    const { path } = arg; // Use provided path or current working directory
    if (!path) {
      return `No path provided. Make sure to follow the JSON schema for this tool.`;
    }

    try {
      const files = await fs.readdir(path);
      return files.join(', ');
    } catch (error) {
      return `Error reading directory at ${path}: "${
        (error as Error).message
      }".`;
    }
  }
}

export default DirectoryReadTool;
