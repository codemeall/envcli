#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required commands
if ! command_exists "shasum"; then
    echo -e "${RED}Error: shasum command not found${NC}"
    exit 1
fi

if ! command_exists "curl"; then
    echo -e "${RED}Error: curl command not found${NC}"
    exit 1
fi

# Get the latest version from package.json
VERSION=$(node -p "require('./package.json').version")
echo -e "${YELLOW}Current version: ${VERSION}${NC}"

# Create the release package
echo -e "${YELLOW}Creating npm package...${NC}"
npm pack

# Calculate SHA256
SHA256=$(shasum -a 256 "envcli-${VERSION}.tgz" | awk '{print $1}')
echo -e "${GREEN}SHA256: ${SHA256}${NC}"

# Update the formula
echo -e "${YELLOW}Updating formula...${NC}"
cat > envcli.rb << EOL
class Envcli < Formula
  desc "A CLI tool for managing environment variables"
  homepage "https://github.com/codemeall/envcli"
  url "https://github.com/codemeall/envcli/releases/download/v${VERSION}/envcli-${VERSION}.tgz"
  sha256 "${SHA256}"
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
      exec "\#{Formula["node"].opt_bin}/node" "\#{libexec}/index.js" "\$@"
    EOS
    
    # Make the bin stub executable
    chmod 0755, bin/"envcli"
  end

  test do
    assert_match "envcli", shell_output("\#{bin}/envcli about")
  end
end
EOL

echo -e "${GREEN}Formula updated successfully!${NC}"

# Instructions for next steps
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Create a new GitHub release with tag v${VERSION}"
echo -e "2. Upload envcli-${VERSION}.tgz to the release"
echo -e "3. Update your Homebrew tap:"
echo -e "   cd /path/to/homebrew-tap"
echo -e "   cp /path/to/envcli.rb Formula/"
echo -e "   git add Formula/envcli.rb"
echo -e "   git commit -m \"envcli ${VERSION}\""
echo -e "   git push origin main"