import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { events } = await request.json();

    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: "Invalid events data" },
        { status: 400 },
      );
    }

    const tempDir = path.join(process.cwd(), "temp");
    await fs.mkdir(tempDir, { recursive: true });

    const eventsPath = path.join(tempDir, `${Date.now()}.json`);
    const outputPath = path.join(tempDir, `${Date.now()}.webm`);

    await fs.writeFile(eventsPath, JSON.stringify(events));
    await execAsync(`rrvideo --input ${eventsPath} --output ${outputPath}`);

    const videoBuffer = await fs.readFile(outputPath);

    await fs.unlink(eventsPath);
    await fs.unlink(outputPath);

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/webm",
        "Content-Disposition": "attachment; filename=recording.webm",
      },
    });
  } catch (error) {
    console.error("Error converting video:", error);
    return NextResponse.json(
      { error: "Error converting video" },
      { status: 500 },
    );
  }
}
