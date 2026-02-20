# Java Configuration for Maven

## Problem
Maven is using Java 11, but Spring Boot 3.2.5 requires Java 17+.

## Solution Options

### Option 1: Configure Maven to Use Java 21 (Recommended)

You have Java 21 installed. Configure Maven to use it:

1. **Find your Java 21 installation path:**
   ```powershell
   # Usually it's in one of these locations:
   # C:\Program Files\Java\jdk-21
   # C:\Program Files\Java\jdk-21.0.1
   ```

2. **Set JAVA_HOME environment variable:**
   ```powershell
   # Temporary (current session only)
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
   
   # Permanent (add to system environment variables)
   [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-21", "User")
   ```

3. **Verify Maven is using correct Java:**
   ```powershell
   mvn -version
   # Should show: Java version: 21.x.x
   ```

4. **Try building again:**
   ```powershell
   cd employee-service
   mvn clean compile
   ```

### Option 2: Install Java 17

1. **Download Java 17:**
   - Visit: https://adoptium.net/temurin/releases/
   - Download JDK 17 (LTS)
   - Install it

2. **Set JAVA_HOME to Java 17:**
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot"
   ```

3. **Verify:**
   ```powershell
   mvn -version
   ```

### Option 3: Use Maven Toolchains (Advanced)

Create `~/.m2/toolchains.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<toolchains>
  <toolchain>
    <type>jdk</type>
    <provides>
      <version>17</version>
    </provides>
    <configuration>
      <jdkHome>C:\Program Files\Java\jdk-21</jdkHome>
    </configuration>
  </toolchain>
</toolchains>
```

---

## Quick Fix (Temporary)

For current PowerShell session only:
```powershell
# Set JAVA_HOME to Java 21
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"

# Verify
java -version
mvn -version

# Build
cd employee-service
mvn clean compile
```

---

## Verify Installation

After configuration, verify:
```powershell
# Check Java version
java -version

# Check Maven Java version
mvn -version

# Should both show Java 17 or 21
```
