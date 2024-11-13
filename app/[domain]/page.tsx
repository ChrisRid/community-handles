import Image from "next/image"
import ImageCoffeQR from "@/assets/images/CoffeQR.png"
import ImageNAFO from "@/assets/images/NAFO.png"
import { AppBskyActorDefs } from "@atproto/api"
import { Check, X } from "lucide-react"

import { agent } from "@/lib/atproto"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CreateNewHandle from "@/components/page/CreateNewHandle"
import { Profile } from "@/components/profile"
import { Stage } from "@/components/stage"

export function generateMetadata({ params }: { params: { domain: string } }) {
  const domain = params.domain
  return {
    title: `${domain} Bluesky Handle`,
    description: `get your own ${domain} handle for Bluesky`,
  }
}

export default async function IndexPage({
  params,
  searchParams,
}: {
  params: {
    domain: string
  }
  searchParams: {
    handle?: string
    "new-handle"?: string
  }
}) {
  const domain = params.domain
  let handle = searchParams.handle
  let newHandle = searchParams["new-handle"]
  let profile: AppBskyActorDefs.ProfileView | undefined
  let error1: string | undefined

  if (handle) {
    try {
      if (!handle.includes(".")) {
        handle += ".bsky.social"
      }
      console.log("fetching profile", handle)
      const actor = await agent.getProfile({
        actor: handle,
      })
      if (!actor.success) throw new Error("fetch was not a success")
      profile = actor.data
    } catch (e) {
      console.error(e)
      error1 = (e as Error)?.message ?? "unknown error"
    }
  }

  return (
    <main className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-4">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Welcome fellas! <br />
          Get your own {domain} <br className="hidden sm:inline" />
          handle for Bluesky
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Follow the instructions below to get your new handle
        </p>
      </div>
      <div>
        <Stage title="Enter your current handle" number={1}>
          <form>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <div className="flex w-full max-w-sm items-center space-x-2">
                {newHandle && (
                  <input type="hidden" name="new-handle" value="" />
                )}
                <Input
                  type="text"
                  name="handle"
                  placeholder="example.bsky.social"
                  defaultValue={handle}
                  required
                />
                <Button type="submit">Submit</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your current Bluesky handle, not including the @<br />
                Please note that your handle is case-sensitive
              </p>
              {error1 && (
                <p className="flex flex-row items-center gap-2 text-sm text-red-500">
                  <X className="size-4" /> Handle not found - please try again
                </p>
              )}
              {profile && (
                <>
                  <p className="text-muted-forground mt-4 flex flex-row items-center gap-2 text-sm">
                    <Check className="size-6 text-green-500" /> Account found
                  </p>
                  <Profile profile={profile} className="mt-4" />
                </>
              )}
            </div>
          </form>
        </Stage>

        <Stage title="Choose your new handle" number={2} disabled={!profile}>
          <CreateNewHandle handle={handle} profile={profile} />
        </Stage>

        <Stage
          title="Change your handle within the Bluesky app"
          number={3}
          disabled={!newHandle}
          last
        >
          <div className="max-w-lg text-sm">
            Once you have submitted your chosen handle above, it will be created
            and you can now change it in the Bluesky app:
            <br />
            <div className="pl-4 pt-2">
              <ol className="list-decimal">
                <li>
                  Go to Settings {">"} Advanced {">"} Change my handle.
                </li>
                <li>
                  Select &quot;I have my own domain&quot; and enter{" "}
                  {newHandle ? `"${newHandle}"` : "your new handle"}.<br />
                </li>
                <li>
                  Leave the setting on DNS Panel and ignore the text box as this
                  is all set up automatically.
                </li>
                <li>Finally, tap &quot;Verify DNS Record&quot;.</li>
              </ol>
            </div>
          </div>
        </Stage>
        <div className="max-w-lg text-sm">
          <p className="mt-2 max-w-lg text-sm">
            This Service is made for the NAFO fellas on Bluesky Visit their
            official website and help support them.
          </p>
          <div className="py-4">
            <a
              href="https://nafo-ofan.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={ImageNAFO}
                width={512}
                height={400}
                alt="NAFO image"
              />
            </a>
          </div>
          <div className="max-w-lg text-center">
            <p className="text-sm">
              To help support the hosting costs for this service:
            </p>
            <p className="py-2 text-center">
              <a
                href="https://buymeacoffee.com/chrisrid"
                target="_blank"
                rel="noopener noreferrer"
              >
                buymeacoffee.com/chrisrid
              </a>
            </p>
            <p>
              (Please prioritize supporting Ukrainian charities / NAFO first)
            </p>
            <div className="py-4">
              <a
                target="_blank"
                href="https://buymeacoffee.com/chrisrid"
                className="inline-block bg-white p-2"
              >
                <Image
                  src={ImageCoffeQR}
                  width={300}
                  height={300}
                  alt="CoffeQR"
                />
              </a>
            </div>
            <p>
              The community-handles project was originally created by mozzius,
              and adapted and hosted by ChrisRid for the NAFO fellas.
            </p>
            <p>Ongoing maintenance and updates are by ChrisRid and Orion.</p>
            <p>
              To support mozzius with the original project, you can sponsor and
              view his work at:
            </p>
            <p>
              <a href="https://github.com/sponsors/mozzius" target="_blank">
                https://github.com/sponsors/mozzius
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
