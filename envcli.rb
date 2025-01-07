class Envcli < Formula
  desc "A CLI tool for managing environment variables"
  homepage "https://github.com/codemeall/envcli"
  url "https://github.com/codemeall/envcli/releases/download/v1.0.4/envcli-1.0.4.tgz"
  sha256 "295b451f4ebcd13e0f020483d0e61abee58cc2dbce7e2dcd7190de230413f9f4"
  license "ISC"

  livecheck do
    url :stable
    strategy :github_latest
  end

  depends_on "node"

  def install
    # Extract the package contents
    system "tar", "xf", cached_download, "-C", buildpath
    
    # Move package contents to libexec
    libexec.install Dir["*"]
    
    # Create bin stubs
    (bin/"envcli").write <<~EOS
      #!/bin/bash
      exec "\#{Formula["node"].opt_bin}/node" "\#{libexec}/index.js" "$@"
    EOS
    
    # Make the bin stub executable
    chmod 0755, bin/"envcli"
  end

  test do
    assert_match "envcli", shell_output("\#{bin}/envcli about")
  end
end
